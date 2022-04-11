import * as React from "react";
import PostIcon from "@material-ui/icons/Book";
import UserIcon from "@material-ui/icons/Group";
import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
  fetchUtils,
} from "react-admin";

import { PostList, PostEdit, PostCreate, PostShow } from "./lists/posts";
import { UserList, UserEdit, UserCreate, UserShow } from "./lists/user";
import authProvider from "./providers/authProvider";
import { LoginWithTheme } from "./components/Auth";
import customRoutes from "./Routes/customRoutes";
import DataProvider from "./providers/DataProvider";

const App = () => (
  <Admin
    basename="/admin"
    dataProvider={DataProvider}
    loginPage={LoginWithTheme}
    authProvider={authProvider}
    customRoutes={customRoutes}
  >
    <Resource
      name="posts"
      icon={PostIcon}
      list={PostList}
      edit={PostEdit}
      create={PostCreate}
      show={PostShow}
    />
    <Resource
      name="user"
      icon={UserIcon}
      list={UserList}
      edit={UserEdit}
      create={UserCreate}
      show={UserShow}
    />
  </Admin>
);
export default App;
