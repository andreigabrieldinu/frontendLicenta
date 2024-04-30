import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getListUser } from "../../services/API/userApi";
import Pagination from "@mui/material/Pagination";
import { toast } from "react-toastify";

export default function UsersAdmin() {
  const user = useSelector((state) => state.auth.login.currentUser);
  const listUser = useSelector((state) => state.user.users.isUser);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [load, setLoad] = useState(false);
  const [pagination, setPagination] = useState({
    page: "1",
    size: "6",
    search: "",
  });
  useEffect(() => {
    getListUser(dispatch, user.token);
  }, [load]);

  const handleDeleteUser = async (id) => {
    await deleteUser(dispatch, id, user.token);
    toast.success("Utilizatorul a fost sters cu succes", {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    setLoad(!load);
  };
  const handleChangePage = (e, value) => {
    e.preventDefault();
    window.scrollTo(0, 0);

    setPage(value);
    setPagination({
      page: value,
      size: pagination.size,
      search: pagination.search,
    });
  };
  return (
    <div className="page-wrapper">
      <div className="page-breadcrumb">
        <div className="row">
          <div className="col-7 align-self-center">
            <h4 className="page-title text-truncate text-dark font-weight-medium mb-1">
              Admin
            </h4>
            <div className="d-flex align-items-center">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0 p-0">
                  <li className="breadcrumb-item">
                    <a href="/" className="text-muted">
                      Tabele
                    </a>
                  </li>
                  <li
                    className="breadcrumb-item text-muted active"
                    aria-current="page"
                  >
                    Utilizatori
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Users</h4>
                <input
                  className="form-control w-25"
                  type="text"
                  placeholder="Cauta dupa ID User"
                  onChange={(e) => {
                    setPagination({
                      page: pagination.page,
                      size: pagination.size,
                      search: e.target.value,
                    });
                  }}
                />
                <br />
                <div className="table-responsive">
                  <table className="table table-striped table-bordered no-wrap">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nume</th>
                        <th>Email</th>
                        <th>Telefon</th>
                        <th>Tip User</th>
                        <th>Editare</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listUser.map((user, index) => {
                        return (
                          <tr key={index}>
                            <td>{user.id}</td>
                            <td>{user.fullname}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.admin == 1 ? "Admin" : "User"}</td>
                            <td>
                              <button
                                style={{ cursor: "pointer", color: "white" }}
                                className="btn btn-danger"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                Sterge
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Pagination count={1} page={1} onChange={handleChangePage} />
      </div>
    </div>
  );
}
