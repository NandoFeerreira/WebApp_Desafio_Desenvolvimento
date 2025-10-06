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

    $('#Solicitante').autocomplete({
        source: function (request, response) {
            $.ajax({
                url: config.contextPath + 'Chamados/AutocompleteSolicitantes',
                type: 'GET',
                data: { term: request.term },
                success: function (data) {
                    response(data);
                },
                error: function () {
                    response([]);
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            $('#Solicitante').val(ui.item.value);
            return false;
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
