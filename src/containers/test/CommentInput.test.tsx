import * as React from "react";
import { shallow } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { CommentInput } from "../CommentInput";
import { Card, CardHeader, TextField, Button } from "@material-ui/core";

Enzyme.configure({ adapter: new Adapter() });

let wrapper: any;
let mockOnCommentImage = jest.fn();
const testSelectedImageDetail = {
  photoURL: "testURL",
  uid: "testUser",
  petSpecies: "degu"
};
const styleObj = {
  cardContent: {
    padding: "3px",
    background: "#FFF",
    margin: "auto",
    width: "90vw"
  },
  postArea: {
    textAlign: "center",
    padding: "3px",
    display: "flex"
  },
  textField: {
    width: "70vw"
  },
  buttonArea: {
    margin: "auto 10px"
  }
};
const testUser = {
  uid: "testUid",
  photoURL: "",
  petSpecies: "degu"
};
const selectedTestUser = {
  uid: "testUid2",
  photoURL: "",
  petSpecies: "degu"
};
// enzymeから読み込んだshallowを使う例
describe("UserCardコンポーネントのテスト", () => {
  beforeEach(() => {
    // == 準備 ==
    // 対象コンポーネントをシャローレンダリング
    wrapper = shallow(
      <CommentInput
        selectedImageDetail={testSelectedImageDetail}
        classes={styleObj}
        onCommentImage={mockOnCommentImage}
      />
    );
  });
  it("子コンポーネントが存在すること", () => {
    // == 検証 ==
    // 各コンポーネントの数を取得し、想定した数であればOK
    expect(wrapper.find("section").length).toBe(1);
    expect(wrapper.find("div").length).toBe(2);
    expect(wrapper.find(TextField).length).toBe(1);
    expect(wrapper.find(Button).length).toBe(1);
  });
  it("コメントが空の場合はコメント登録処理は実行されない", () => {
    wrapper.setState({
      postComment: ""
    });
    wrapper.find(Button).simulate("click");
    expect(mockOnCommentImage.mock.calls.length).toBe(0);
  });
  it("コメントが空でない場合はコメント登録処理は実行される", () => {
    wrapper.setState({
      postComment: "test"
    });
    wrapper.find(Button).simulate("click");
    expect(mockOnCommentImage.mock.calls.length).toBe(1);
  });
});
