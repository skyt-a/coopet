import * as React from "react";
import { shallow } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { UserCard } from "../UserCard";
import { Card, CardHeader } from "@material-ui/core";

Enzyme.configure({ adapter: new Adapter() });

let wrapper: any;
let mockOnSelectUser: any;
let mockOnHistoryPush: any;
const styleObj = {
  userCard: {
    width: "95%",
    margin: "auto"
  },
  flex: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center"
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
    mockOnSelectUser = jest.fn();
    mockOnHistoryPush = jest.fn();
    wrapper = shallow(
      <UserCard
        user={selectedTestUser}
        onSelectUser={mockOnSelectUser}
        classes={styleObj}
        auth={{
          additionalUserInfo: testUser
        }}
        history={{
          push: mockOnHistoryPush
        }}
      />
    );
  });
  it("子コンポーネントが存在すること", () => {
    // == 検証 ==
    // 各コンポーネントの数を取得し、想定した数であればOK
    expect(wrapper.find(Card).length).toBe(1);
    expect(wrapper.find(CardHeader).length).toBe(1);
  });
  it("認証ユーザーと選択ユーザーが違う場合はユーザー選択処理が実行されること", () => {
    wrapper.find(Card).simulate("click");
    expect(mockOnSelectUser.mock.calls.length).toBe(1);
    expect(mockOnHistoryPush.mock.calls.length).toBe(1);
  });
  it("認証ユーザーと選択ユーザーが一緒の場合はユーザー選択処理が実行されないこと", () => {
    wrapper = shallow(
      <UserCard
        user={testUser}
        onSelectUser={mockOnSelectUser}
        classes={styleObj}
        auth={{
          additionalUserInfo: testUser
        }}
        history={{
          push: mockOnHistoryPush
        }}
      />
    );
    wrapper.find(Card).simulate("click");
    expect(mockOnSelectUser.mock.calls.length).toBe(0);
    expect(mockOnHistoryPush.mock.calls.length).toBe(0);
  });
});
