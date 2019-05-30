import React, { Component } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Avatar, Card, CardHeader, Chip } from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import animalSpecies from "../assets/data/animalSpecies.json";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    card: {
      margin: theme.spacing.unit,
      padding: theme.spacing.unit
    },
    userCard: {
      width: "95%"
    },
    flex: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center"
    }
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  user: any;
  onSelectUser?: Function;
}

class UserCard extends Component<Props> {
  goToUserDetail = (selectedUserInfo: any) => (e: any) => {
    if (this.props.onSelectUser) {
      this.props.onSelectUser(selectedUserInfo);
    }
    this.props.history.push("/otherView");
  };

  render() {
    const { classes } = this.props;
    return (
      <Card
        className={classes.userCard}
        onClick={this.goToUserDetail(this.props.user)}
      >
        <CardHeader
          avatar={
            <Avatar
              alt="Remy Sharp"
              src={this.props.user.photoURL}
              className={classes.avatar}
            />
          }
          action={
            <Chip
              color="primary"
              label={
                animalSpecies.filter(
                  ele => ele.id === this.props.user.petSpecies
                )[0].name
              }
              className={classes.chip}
              variant="outlined"
            />
          }
          title={this.props.user.userName}
          subheader={this.props.user.petName}
        />
      </Card>
    );
  }
}

export default withStyles(styles)(withRouter(UserCard));
