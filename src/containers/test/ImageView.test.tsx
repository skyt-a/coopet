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
  CardMedia,
  TextField,
  Switch
} from "@material-ui/core";
import { ImageView } from "../ImageView";
import CommentInput from "../CommentInput";
import ImageList from "../../components/ImageList";

Enzyme.configure({ adapter: new Adapter() });

let wrapper: any;
let mockOnSelectUser = jest.fn();
let mockOnClose = jest.fn();
let mockOnLikeImage = jest.fn();
let mockOnDislikeImage = jest.fn();
let mockOnDeleteImage = jest.fn();
let mockOnHistoryPush = jest.fn();
const styleObj = {
  root: {
    textAlign: "center"
  },
  select: {
    width: "60vw"
  },
  card: {
    margin: "8px",
    padding: "10px"
  },
  badge: {
    flexBasis: "calc(100% / 3.1)"
  },
  flex: {
    display: "flex",
    flexWrap: "wrap",
    overflow: "auto"
  },
  uploadedImageWrap: {
    position: "relative",
    height: "150px",
    border: "1px solid rgba(0, 0, 0, 0.12)",
    margin: "1px"
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    objectFit: "scale-down"
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
      <ImageView
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
    expect(wrapper.find(TextField).length).toBe(1);
    expect(wrapper.find(ImageList).length).toBe(1);
  });
});
