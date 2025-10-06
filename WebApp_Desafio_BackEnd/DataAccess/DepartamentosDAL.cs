using System.Collections.Generic;
using System.Data.SQLite;
using WebApp_Desafio_BackEnd.Models;

namespace WebApp_Desafio_BackEnd.DataAccess
{
    public class DepartamentosDAL : BaseDAL
    {
        public IEnumerable<Departamento> ListarDepartamentos()
        {
            IList<Departamento> lstDepartamentos = new List<Departamento>();

            using (SQLiteConnection dbConnection = new SQLiteConnection(CONNECTION_STRING))
            {
                using (SQLiteCommand dbCommand = dbConnection.CreateCommand())
                {

                    dbCommand.CommandText = "SELECT * FROM departamentos ";

                    dbConnection.Open();

                    using (SQLiteDataReader dataReader = dbCommand.ExecuteReader())
                    {
                        var departamento = Departamento.Empty;

                        while (dataReader.Read())
                        {
                            departamento = new Departamento();

                            if (!dataReader.IsDBNull(0))
                                departamento.ID = dataReader.GetInt32(0);
                            if (!dataReader.IsDBNull(1))
                                departamento.Descricao = dataReader.GetString(1);

                            lstDepartamentos.Add(departamento);
                        }
                        dataReader.Close();
                    }
                    dbConnection.Close();
                }

            }

            return lstDepartamentos;
        }

        public Departamento ObterDepartamentoPorId(int idDepartamento)
        {
            var departamento = Departamento.Empty;

            using (SQLiteConnection dbConnection = new SQLiteConnection(CONNECTION_STRING))
            {
                using (SQLiteCommand dbCommand = dbConnection.CreateCommand())
                {
                    dbCommand.CommandText = $"SELECT ID, Descricao FROM departamentos WHERE ID = {idDepartamento}";

                    dbConnection.Open();

                    using (SQLiteDataReader dataReader = dbCommand.ExecuteReader())
                    {
                        if (dataReader.Read())
                        {
                            departamento = new Departamento();

                            if (!dataReader.IsDBNull(0))
                                departamento.ID = dataReader.GetInt32(0);
                            if (!dataReader.IsDBNull(1))
                                departamento.Descricao = dataReader.GetString(1);
                        }
                        dataReader.Close();
                    }
                    dbConnection.Close();
                }
            }

            return departamento;
        }

        public bool InserirDepartamento(string Descricao)
        {
            int regsAfetados = -1;

            using (SQLiteConnection dbConnection = new SQLiteConnection(CONNECTION_STRING))
            {
                using (SQLiteCommand dbCommand = dbConnection.CreateCommand())
                {
                    dbCommand.CommandText = "INSERT INTO departamentos (Descricao) VALUES (@Descricao)";
                    dbCommand.Parameters.AddWithValue("@Descricao", Descricao);

                    dbConnection.Open();
                    regsAfetados = dbCommand.ExecuteNonQuery();
                    dbConnection.Close();
                }
            }

            return (regsAfetados > 0);
        }

        public bool AtualizarDepartamento(int ID, string Descricao)
        {

            var departamentoExistente = ObterDepartamentoPorId(ID);
            if (departamentoExistente == null || departamentoExistente.ID == 0)
            {
                throw new System.ArgumentException($"Departamento com ID {ID} não encontrado.");
            }

            int regsAfetados = -1;

            using (SQLiteConnection dbConnection = new SQLiteConnection(CONNECTION_STRING))
            {
                using (SQLiteCommand dbCommand = dbConnection.CreateCommand())
                {
                    dbCommand.CommandText = "UPDATE departamentos SET Descricao=@Descricao WHERE ID=@ID";
                    dbCommand.Parameters.AddWithValue("@Descricao", Descricao);
                    dbCommand.Parameters.AddWithValue("@ID", ID);

                    dbConnection.Open();
                    regsAfetados = dbCommand.ExecuteNonQuery();
                    dbConnection.Close();
                }
            }

            return (regsAfetados > 0);
        }

        public bool ExcluirDepartamento(int idDepartamento)
        {
            int regsAfetados = -1;

            using (SQLiteConnection dbConnection = new SQLiteConnection(CONNECTION_STRING))
            {
                using (SQLiteCommand dbCommand = dbConnection.CreateCommand())
                {
                    dbCommand.CommandText = $"DELETE FROM departamentos WHERE ID = {idDepartamento}";

                    dbConnection.Open();
                    regsAfetados = dbCommand.ExecuteNonQuery();
                    dbConnection.Close();
                }
            }

            return (regsAfetados > 0);
        }
    }
}