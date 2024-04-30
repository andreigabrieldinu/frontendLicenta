import Chat from "../components/Admin/Chat";
import HistoryAdmin from "../components/Admin/HistoryAdmin";
import HomeAdmin from "../components/Admin/HomeAdmin";
import ProductsAdmin from "../components/Admin/ProductsAdmin";
import UsersAdmin from "../components/Admin/UsersAdmin";
import VoucherAdmin from "../components/Admin/VoucherAdmin";
import SuppliersAdmin from "../components/Admin/SuppliersAdmin";
import WineAdmin from "../components/Admin/WineAdmin";
import WineAnalysis from "../components/Admin/WineAnalysis";
import WineBottling from "../components/Admin/WineBottling";
import GrapesAdmin from "../components/Admin/GrapesAdmin";
import GrapesWineAdmin from "../components/Admin/GrapesWineAdmin";
import ContainersAdmin from "../components/Admin/ContainersAdmin";
import FieldsAdmin from "../components/Admin/FieldsAdmin";
import WineBlending from "../components/Admin/WineBlending";

const adminRoutes = [
  {
    path: "/admin",
    component: HomeAdmin,
  },
  {
    path: "/chat",
    component: Chat,
  },
  {
    path: "/users",
    component: UsersAdmin,
  },
  {
    path: "/products",
    component: ProductsAdmin,
  },
  {
    path: "/history",
    component: HistoryAdmin,
  },
  {
    path: "/vouchers",
    component: VoucherAdmin,
  },
  {
    path: "/suppliers",
    component: SuppliersAdmin,
  },
  {
    path: "/wines",
    component: WineAdmin,
  },
  {
    path: "/winesAnalysis",
    component: WineAnalysis,
  },
  {
    path: "/botteledWines",
    component: WineBottling,
  },
  {
    path: "/grapes",
    component: GrapesAdmin,
  },
  {
    path: "/wineGrapes",
    component: GrapesWineAdmin,
  },
  {
    path: "/containers",
    component: ContainersAdmin,
  },
  {
    path: "/fields",
    component: FieldsAdmin,
  },
  {
    path: "/winesBlending",
    component: WineBlending,
  },
];

export default adminRoutes;
