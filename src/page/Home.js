import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getListProduct } from "../services/API/productApi";
import ProductBigSale from "../components/ProductBigSale";
import ProductForYou from "../components/ProductForYou";
import Details from "../components/Details";

export default function Home() {
  const listProduct = useSelector(
    (state) => state.product.products?.allProduct
  );

  const dispatch = useDispatch();

  useEffect(() => {
    getListProduct(dispatch);
  }, []);

  const productDiscount = listProduct?.filter((product) => {
    return product.promotionPercent >= 20;
  });

  return (
    <div className="page-holder">
      <div className="header bg-white">
        <div className="container">
          <div
            className="hero pb-3 bg-cover bg-center d-flex align-items-center responsive-image"
            style={{
              backgroundImage: `url("/image/banner1.jpg")`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              maxWidth: "100%",
              height: "200px",
              // width: "1200px",
            }}
          >
            <div className="container py-5">
              <div className="row px-4 px-lg-5">
                <div className="col-lg-6">
                  <h1
                    className="h2 text-uppercase mb-3"
                    style={{ color: "rgba(234, 51, 101, 1)" }}
                  >
                    Reduceri de pana la 40%
                  </h1>
                  <a className="btn btn-danger" href="/shop">
                    Vedeti colectia de vinuri aici
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-5">
            <div className="text-center">
              <h2 className="h5 text-uppercase mb-4">Podgoria DinuVia</h2>
            </div>
            <div className="row">
              <div className="col-lg-4 mb-3 mb-lg-0">
                <div className="d-inline-block">
                  <div className="media align-items-end">
                    <div className="media-body text-left ml-3">
                      <h6 className="text-uppercase mb-1">
                        Despre Crama noastra
                      </h6>
                      <p className="text-small mb-0 text-muted">
                        Cu o istorie bogata si o pasiune inegalabila pentru
                        viticultura, Podgoria DinuVia este cunoscuta pentru
                        productia de vinuri premium de inalta calitate. Aici,
                        traditia se imbina armonios cu tehnologia moderna,
                        rezultand vinuri care incanta simturile si transpun
                        povestea si caracterul teritoriului in fiecare picatura.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-4 mb-md-0">
                <div className="d-inline-block">
                  <div className="media align-items-end">
                    <div className="media-body text-left ml-3">
                      <h6 className="text-uppercase mb-1">
                        Vinurile pe care le vindem
                      </h6>
                      <p className="text-small mb-0 text-muted">
                        In crama Podgoria DinuVia, artizanii vinului isi dedica
                        timpul si talentul pentru a crea vinuri exceptionale.
                        Fiecare etapa a procesului de productie este
                        supravegheata cu meticulozitate, de la fermentatie si
                        maturare, pâna la imbuteliere. Fie ca este vorba de
                        vinuri albe racoritoare, vinuri rosii complexe sau
                        vinuri rose elegante, Podgoria DinuVia ofera o gama
                        variata de selectii care satisfac chiar si cele mai
                        rafinate gusturi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-4 mb-md-0">
                <div className="d-inline-block">
                  <div className="media align-items-end">
                    <div className="media-body text-left ml-3">
                      <h6 className="text-uppercase mb-1">
                        Informatii comenzi
                      </h6>
                      <p className="text-small mb-0 text-muted">
                        Descopera magazinul nostru online de vinuri! Livrare
                        gratuita prin partenerii nostri, plata simpla prin
                        ramburs sau card, si facturare electronica. Bucura-te de
                        selectia noastra diversa de vinuri de calitate, fara
                        batai de cap. Comanda acum si savureaza vinurile
                        preferate in confortul casei tale.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="py-5" id="section_product">
            <div>
              <h2 className="h5 text-uppercase mb-4">Produse la reducere</h2>
            </div>
            <div className="row d-block">
              <ProductBigSale productDiscount={productDiscount} />
            </div>
          </div>
          <div className="py-5" id="section_product">
            <div>
              <h2 className="h5 text-uppercase mb-4">Produse pentru tine</h2>
            </div>
            <div className="row d-block">
              <ProductForYou listProduct={listProduct} />
            </div>
          </div>
          <Details />
        </div>
      </div>
    </div>
  );
}
