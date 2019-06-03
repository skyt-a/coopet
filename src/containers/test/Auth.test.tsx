import * as React from "react";
import { shallow } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Auth } from "../Auth";
import { Card, List, Button, Typography, TextField } from "@material-ui/core";
import Loading from "../../components/Loading";

Enzyme.configure({ adapter: new Adapter() });

let wrapper: any;
let mockOnAuth = jest.fn();
let mockOnSignUp = jest.fn();
let mockOnUpdateUser = jest.fn();
let mockOnStoreUserInfo = jest.fn();
let mockOnHistoryPush = jest.fn();

const testUser = {
  uid: "testUid",
  photoURL: "",
  petSpecies: "degu"
};
const styleObj = {
  button: {
    margin: "8px"
  },
  card: {
    margin: "8px"
  },
  paper: {
    textAlign: "center",
    padding: "8px"
  },
  listItemInner: {
    margin: "auto"
  },
  progress: {
    margin: "auto"
  },
  progressWrapper: {
    textAlign: "center"
  },
  dog: {
    height: "80px",
    position: "absolute",
    right: "10px"
  },
  type: {
    fontSize: "1.1rem"
  }
};
// enzymeから読み込んだshallowを使う例
describe("Authコンポーネントのテスト", () => {
  beforeEach(() => {
    // == 準備 ==
    // 対象コンポーネントをシャローレンダリング
    wrapper = shallow(
      <Auth
        auth={testUser}
        onAuth={mockOnAuth}
        onSignUp={mockOnSignUp}
        onUpdateUser={mockOnUpdateUser}
        onStoreUserInfo={mockOnStoreUserInfo}
        classes={styleObj}
        history={{
          push: mockOnHistoryPush
        }}
      />
    );
  });
  it("子コンポーネントが存在すること", () => {
    // == 検証 ==
    // Loadingコンポーネント存在確認
    expect(wrapper.find(List).length).toBe(1);
    expect(wrapper.find(Card).length).toBe(2);
    expect(wrapper.find(Button).length).toBe(5);
    expect(wrapper.find(Typography).length).toBe(2);
    expect(wrapper.find(TextField).length).toBe(2);

    // 画面遷移処理実行確認
    // expect(mockOnHistoryPush.mock.calls.length).toBe(1);
  });
  it("state更新確認", () => {
    wrapper.setState({
      email: "test@test.com",
      password: "testtest"
    });
    // == 検証 ==
    // UI更新確認
    expect(wrapper.find(TextField).get(0).props.value).toBe("test@test.com");
    expect(wrapper.find(TextField).get(1).props.value).toBe("testtest");
  });
  it("ローディング表示確認", () => {
    wrapper.setState({
      loading: true
    });
    // == 検証 ==
    // UI更新確認
    expect(wrapper.find(Loading).length).toBe(1);
  });
});
