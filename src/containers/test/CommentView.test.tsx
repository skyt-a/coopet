import * as React from "react";
import { shallow } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { TextField, Button, CardContent, Typography } from "@material-ui/core";
import { CommentsView } from "../CommentsView";

Enzyme.configure({ adapter: new Adapter() });

let wrapper: any;
let mockOnCancel = jest.fn();
let mockOnSelectUser = jest.fn();

const testSelectedImageDetail = {
  photoURL: "testURL",
  uid: "testUser",
  petSpecies: "degu"
};
const styleObj = {
  cardContent: {
    padding: "5px"
  },
  avatarLeft: {
    bottom: 0,
    left: 0,
    top: "20px",
    display: "inline-block",
    position: "absolute"
  },
  avatarRight: {
    bottom: 0,
    right: 0,
    top: "20px",
    display: "inline-block",
    position: "absolute"
  },
  userNameRight: {
    position: "absolute",
    right: 0
  },
  userNameLeft: {
    position: "absolute",
    left: 0
  },
  balloonSetBox: {
    display: "flex",
    flexWrap: "wrap",
    position: "relative"
  },
  balloon: {
    position: "relative",
    display: "inline-block",
    maxWidth: "300px",
    padding: "8px 15px",
    background: "#f0f0f0",
    textAlign: "left",
    borderRadius: "15px",
    marginTop: "20px",
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
    marginLeft: "45px",
    marginRight: "auto",
    "&::after": {
      left: "-10px"
    }
  },
  rightBalloon: {
    flexDirection: "row-reverse",
    marginRight: "45px",
    marginLeft: "auto",
    "&::after": {
      right: "-10px"
    }
  },
  postArea: {
    textAlign: "center",
    padding: "3px"
  },
  buttonArea: {
    display: "flex",
    justifyContent: "space-around"
  },
  actionButton: {
    minWidth: "30vw"
  }
};
const commenteds = [
  {
    comment: "テスト1",
    uid: "ICZ0Ek3RSKW6E6T4eVVaaxU0Kfg2",
    key: "9005639791562713ICZ0Ek3RSKW6E6T4eVVaaxU0Kfg2"
  },
  {
    comment: "テスト2",
    uid: "ICZ0Ek3RSKW6E6T4eVVaaxU0Kfg2",
    key: "9005639791562713ICZ0Ek3RSKW6E6T4eVVaaxU0Kfg2"
  }
];
const testUser = {
  uid: "aaaaa",
  photoURL: "testURL",
  petSpecies: "degu"
};
const commentUserMast = {
  ICZ0Ek3RSKW6E6T4eVVaaxU0Kfg2: {
    userName: "aaaa"
  }
};
// enzymeから読み込んだshallowを使う例
describe("UserCardコンポーネントのテスト", () => {
  beforeEach(() => {
    // == 準備 ==
    // 対象コンポーネントをシャローレンダリング
    wrapper = shallow(
      <CommentsView
        selectedImageDetail={testSelectedImageDetail}
        classes={styleObj}
        onSelectUser={mockOnSelectUser}
      />
    );
    wrapper.setState({
      userInfo: testUser,
      commenteds: commenteds,
      commentUserMast: commentUserMast
    });
  });
  it("子コンポーネントが存在すること", () => {
    // == 検証 ==
    // 各コンポーネントの数を取得し、想定した数であればOK
    expect(wrapper.find(CardContent).length).toBe(1);
    // コメントの数
    expect(wrapper.find(Typography).length).toBe(2);
  });
});
