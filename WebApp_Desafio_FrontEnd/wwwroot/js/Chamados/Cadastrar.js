$(document).ready(function () {

    $('.glyphicon-calendar').closest("div.date").datepicker({
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        calendarWeeks: false,
        format: 'dd/mm/yyyy',
        autoclose: true,
        language: 'pt-BR'
    });

    // Autocomplete customizado para Solicitante
    var solicitanteTimeout;
    var $autocompleteList = $('<ul class="autocomplete-list"></ul>');
    $('#Solicitante').after($autocompleteList);

    $('#Solicitante').on('input', function () {
        var termo = $(this).val();

        clearTimeout(solicitanteTimeout);

        if (termo.length < 2) {
            $autocompleteList.hide().empty();
            return;
        }

        solicitanteTimeout = setTimeout(function () {
            $.ajax({
                url: config.contextPath + 'Chamados/AutocompleteSolicitantes',
                type: 'GET',
                data: { term: termo },
                success: function (data) {
                    $autocompleteList.empty();

                    if (data && data.length > 0) {
                        data.forEach(function (item) {
                            var $li = $('<li></li>')
                                .text(item.value || item.label || item)
                                .on('click', function () {
                                    $('#Solicitante').val(item.value || item.label || item);
                                    $autocompleteList.hide().empty();
                                });
                            $autocompleteList.append($li);
                        });
                        $autocompleteList.show();
                    } else {
                        $autocompleteList.hide();
                    }
                },
                error: function () {
                    $autocompleteList.hide().empty();
                }
            });
        }, 300);
    });

    // Esconder lista ao clicar fora
    $(document).on('click', function (e) {
        if (!$(e.target).closest('#Solicitante, .autocomplete-list').length) {
            $autocompleteList.hide();
        }
    });

    // Navegar com teclado (setas e Enter)
    $('#Solicitante').on('keydown', function (e) {
        var $items = $autocompleteList.find('li');
        var $selected = $items.filter('.selected');

        if (e.keyCode === 40) { // Seta para baixo
            e.preventDefault();
            if ($selected.length === 0) {
                $items.first().addClass('selected');
            } else {
                $selected.removeClass('selected').next().addClass('selected');
            }
        } else if (e.keyCode === 38) { // Seta para cima
            e.preventDefault();
            $selected.removeClass('selected').prev().addClass('selected');
        } else if (e.keyCode === 13) { // Enter
            if ($selected.length > 0) {
                e.preventDefault();
                $selected.click();
            }
        } else if (e.keyCode === 27) { // ESC
            $autocompleteList.hide();
        }
    });

    $('#btnCancelar').click(function () {
        Swal.fire({
            html: "Deseja cancelar essa operação? O registro não será salvo.",
            type: "warning",
            showCancelButton: true,
        }).then(function (result) {
            if (result.value) {
                history.back();
            } else {
                console.log("Cancelou a inclusão.");
            }
        });
    });

    $('#btnSalvar').click(function () {

        if ($('#form').valid() != true) {
            FormularioInvalidoAlert();
            return;
        }

        let dataAbertura = $('#DataAbertura').val();
        if (dataAbertura) {
            let partesData = dataAbertura.split('/');
            let dataInformada = new Date(partesData[2], partesData[1] - 1, partesData[0]);
            let hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            dataInformada.setHours(0, 0, 0, 0);

            if (dataInformada < hoje) {
                Swal.fire({
                    text: 'Não é permitido criar chamados com data retroativa.',
                    confirmButtonText: 'OK',
                    icon: 'error'
                });
                return;
            }
        }

        let chamado = SerielizeForm($('#form'));
        let url = $('#form').attr('action');
        //debugger;

        $.ajax({
            type: "POST",
            url: url,
            data: chamado,
            success: function (result) {

                Swal.fire({
                    type: result.Type,
                    title: result.Title,
                    text: result.Message,
                }).then(function () {
                    window.location.href = config.contextPath + result.Controller + '/' + result.Action;
                });

            },
            error: function (result) {

                Swal.fire({
                    text: result,
                    confirmButtonText: 'OK',
                    icon: 'error'
                });

            },
        });
    });

});
