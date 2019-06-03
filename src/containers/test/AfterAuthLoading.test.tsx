import * as React from "react";
import { shallow } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { AfterAuthLoading } from "../AfterAuthLoading";
import Loading from "../../components/Loading";

Enzyme.configure({ adapter: new Adapter() });

let wrapper: any;
let mockOnStoreUserInfo: any;
let mockOnHistoryPush: any;

// enzymeから読み込んだshallowを使う例
describe("AfterAuthLoadingコンポーネントのテスト", () => {
  beforeEach(() => {
    // == 準備 ==
    // 対象コンポーネントをシャローレンダリング
    mockOnStoreUserInfo = jest.fn();
    mockOnHistoryPush = jest.fn();
    wrapper = shallow(
      <AfterAuthLoading
        onStoreUserInfo={mockOnStoreUserInfo}
        history={{
          push: mockOnHistoryPush
        }}
      />
    );
  });
  it("子コンポーネントが存在すること", () => {
    const mock = jest.spyOn(wrapper.instance(), "getFirebaseCurrentUser");
    mock.mockImplementation(() => {
      // getDatabase() メソッドを偽装する
      return { uid: "" };
    });
    // == 検証 ==
    // Loadingコンポーネント存在確認
    expect(wrapper.find(Loading).length).toBe(1);
  });
  it("画面遷移処理実行確認", () => {
    const mock = jest.spyOn(wrapper.instance(), "getFirebaseCurrentUser");
    mock.mockImplementation(() => {
      // getDatabase() メソッドを偽装する
      return { uid: "" };
    });
    // == 検証 ==
    // 画面遷移処理実行確認
    expect(mockOnHistoryPush.mock.calls.length).toBe(1);
  });
});
