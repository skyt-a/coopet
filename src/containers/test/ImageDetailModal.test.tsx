import * as React from "react";
import { shallow } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { ImageDetailModal } from "../ImageDetailModal";
import {
  Card,
  CardHeader,
  Modal,
  Dialog,
  CardContent,
  CardMedia
} from "@material-ui/core";
import CommentsView from "../CommentsView";
import CommentInput from "../CommentInput";

Enzyme.configure({ adapter: new Adapter() });

let wrapper: any;
let mockOnSelectUser = jest.fn();
let mockOnClose = jest.fn();
let mockOnLikeImage = jest.fn();
let mockOnDislikeImage = jest.fn();
let mockOnDeleteImage = jest.fn();
let mockOnHistoryPush = jest.fn();
const styleObj = {
  modal: {
    overflow: "auto",
    outline: "none"
  },
  modalContent: {
    outline: "none"
  },
  media: {
    objectFit: "contain",
    width: "80vw",
    margin: "auto",
    maxHeight: "30vh"
  },
  likeIcon: {
    width: "2rem",
    height: "2rem"
  },
  balloon: {
    position: "relative",
    display: "inline-block",
    maxWidth: "300px",
    padding: "8px 15px",
    background: "#f0f0f0",
    textAlign: "left",
    borderRadius: "15px",
    marginTop: "5px",
    wordBreak: "break-all",
    "&::after": {
      content: "''",
      border: "14px solid transparent",
      borderTopColor: "#f0f0f0",
      position: "absolute",
      top: "0"
    }
  },
  leftBalloon: {
    flexDirection: "row",
    marginRight: "auto",
    marginLeft: "30px",
    "&::after": {
      left: "-10px"
    }
  },
  commentInputArea: {
    marginTop: "10px"
  },
  modalFooter: {
    marginTop: "10px",
    width: "90vw",
    margin: "auto",
    display: "flex",
    justifyContent: "space-between"
  }
};
const testUser = {
  uid: "testUid2",
  photoURL: "",
  petSpecies: "degu"
};
const imageDetail = {
  uid: "testUid2",
  comment: "test"
};
// enzymeから読み込んだshallowを使う例
describe("ImageDetailModalコンポーネントのテスト", () => {
  beforeEach(() => {
    // == 準備 ==
    // 対象コンポーネントをシャローレンダリング
    wrapper = shallow(
      <ImageDetailModal
        user={testUser}
        selectedImageDetail={imageDetail}
        onClose={mockOnClose}
        onSelectUser={mockOnSelectUser}
        onLikeImage={mockOnLikeImage}
        onDislikeImage={mockOnDislikeImage}
        onDeleteImage={mockOnDeleteImage}
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
    expect(wrapper.find(Modal).length).toBe(1);
    expect(wrapper.find(Dialog).length).toBe(1);
    expect(wrapper.find(Card).length).toBe(1);
    expect(wrapper.find(CardContent).length).toBe(1);
    expect(wrapper.find(CardMedia).length).toBe(1);
    expect(wrapper.find(CommentsView).length).toBe(1);
    expect(wrapper.find(CommentInput).length).toBe(1);
    expect(wrapper.find("#deleteButton").length).toBe(1);
    expect(wrapper.find("#likeButton").length).toBe(1);
    expect(wrapper.find("#closeButton").length).toBe(1);
  });
  it("お気に入りボタンクリック", () => {
    // == 検証 ==
    // 各コンポーネントの数を取得し、想定した数であればOK
    const mock = jest.spyOn(wrapper.instance(), "clickLike");
    mock.mockImplementationOnce(() => {
      // clickLike() メソッドを偽装する
      return "test";
    });
    wrapper.instance().forceUpdate();
    // == 検証 ==
    // お気に入りボタンクリック確認
    wrapper.find("#likeButton").simulate("click");
    expect(mock).toHaveBeenCalled();
  });
  it("閉じるボタンクリック", () => {
    // == 検証 ==
    // 各コンポーネントの数を取得し、想定した数であればOK
    const mock = jest.spyOn(wrapper.instance(), "onCancel");
    mock.mockImplementationOnce(() => {
      // onCancel() メソッドを偽装する
      return "test";
    });
    wrapper.instance().forceUpdate();
    // == 検証 ==
    // 閉じるボタンクリック確認
    wrapper.find("#closeButton").simulate("click");
    expect(mock).toHaveBeenCalled();
  });
  it("削除ボタンクリック", () => {
    // == 検証 ==
    // 各コンポーネントの数を取得し、想定した数であればOK
    const mock = jest.spyOn(wrapper.instance(), "handleOpenCheckDeleteDialog");
    mock.mockImplementationOnce(() => {
      // handleOpenCheckDeleteDialog() メソッドを偽装する
      return "test";
    });
    wrapper.instance().forceUpdate();
    // == 検証 ==
    // 削除ボタンクリック確認
    wrapper.find("#deleteButton").simulate("click");
    expect(mock).toHaveBeenCalled();
  });
});
