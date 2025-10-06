using System;
using System.Collections.Generic;
using WebApp_Desafio_BackEnd.DataAccess;
using WebApp_Desafio_BackEnd.Models;

namespace WebApp_Desafio_BackEnd.Business
{
    public class ChamadosBLL
    {
        private ChamadosDAL dal = new ChamadosDAL();

        public IEnumerable<Chamado> ListarChamados()
        {
            return dal.ListarChamados();
        }

        public Chamado ObterChamado(int idChamado)
        {
            return dal.ObterChamado(idChamado);
        }

        public bool InserirChamado(string Assunto, string Solicitante, int IdDepartamento, DateTime DataAbertura)
        {
            // Validação: não permitir data retroativa
            if (DataAbertura.Date < DateTime.Now.Date)
            {
                throw new ArgumentException("Não é permitido criar chamados com data retroativa.");
            }

            return dal.InserirChamado(Assunto, Solicitante, IdDepartamento, DataAbertura);
        }

        public bool AtualizarChamado(int ID, string Assunto, string Solicitante, int IdDepartamento, DateTime DataAbertura)
        {         
          
            return dal.AtualizarChamado(ID, Assunto, Solicitante, IdDepartamento, DataAbertura);
        }

        public bool ExcluirChamado(int idChamado)
        {
            return dal.ExcluirChamado(idChamado);
        }

        public IEnumerable<string> ListarSolicitantes()
        {
            return dal.ListarSolicitantes();
        }
    }
}
