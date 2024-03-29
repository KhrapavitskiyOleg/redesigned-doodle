/* eslint-disable no-unused-vars */
import Axios from "axios";
import React, { Component } from "react";
import ImageUpload from "../../../Containers/ImageUpload/ImageUpload";
import Spinner from "../../../Containers/Spinner/Spinner";
export class CreatePost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Post: {
        id: "",
        username: "",
        bio: "",
        imagePath: "",
        created: "",
      },
      error: {
        message: "",
        code: "",
      },
      isloading: false,

      haserror: false,
      errors: {
        username: "",
        bio: "",
        imagePath: "",
      },
    };
    this.mySubmitHandler = this.mySubmitHandler.bind(this);
    this.myChangeHandler = this.myChangeHandler.bind(this);
  }

  componentDidMount() {
    let path = this.props.match.path;
    let id = this.props.match.params.id;
    if (path === "/profile/edit/:id") {
      this.setState((pre) => ({
        isloading: true,
      }));
      Axios.get("/profile/viewprofile")
        .then((data) => {
          let post = data.data.profile;
          this.setState({
            isloading: false,
            Post: {
              ...this.state.Post,
              id: post._id,
              username: post.username,
              bio: post.bio,
              imagePath: post.imagePath,
            },
          });
        })
        .catch((e) => {
          this.setState({
            isloading: false,
            error: {
              ...this.state.error,
              message: e.response.data.message,
              code: e.response.status,
            },
          });
        });
    }
  }

  imageHandler = (id, value, isValid) => {
    this.setState({ Post: { ...this.state.Post, [id]: value } }, () => {});
  };
  profileData = (name) => {
    let bugs = localStorage.getItem("profileData");
    if (bugs) {
      var bugsData = JSON.parse(bugs);
    }
    return bugsData?.bugs.includes(name);
  };

  myChangeHandler = (event) => {
    let nam = event.target?.name;
    let val = event.target?.value;
    let errors = this.state.errors;
    const { name, value } = event.target;
    switch (name) {
      case "username":
        if (value.length > 0) {
          errors.username =
            value.length < 6 ? "Username  must be 5 characters long!" : "";
        }

        if (value.length === 0) {
          errors.username = value.length === 0 ? "username is required!" : "";
        }
        break;

      case "bio":
        if (value.length === 0) {
          errors.bio = value.length === 0 ? "Bio is required!" : "";
        }
        if (value.length > 0) {
          errors.bio =
            value.length < 20 ? "Bio must be 20 characters long!" : "";
        }
        break;
      default:
        break;
    }

    this.setState(
      { ...errors, Post: { ...this.state.Post, [nam]: val } },
      () => {}
    );
  };

  mySubmitHandler(e) {
    this.setState((pre) => ({
      isloading: true,
    }));
    let path = this.props.match.path;
    let id = this.props.match.params.id;

    e.preventDefault();
    let formData;
    if (typeof this.state.Post.imagePath === "object") {
      formData = new FormData();
      formData.append("id", this.state.Post.id);
      formData.append("username", this.state.Post.username);
      formData.append("bio", this.state.Post.bio);
      formData.append(
        "image",
        this.state.Post.imagePath,
        this.state.Post.username
      );
    } else {
      formData = {
        id: this.state.Post.id,
        username: this.state.Post.username,
        bio: this.state.Post.bio,
        image: this.state.Post.imagePath,
      };
    }

    if (path === "/profile/edit/:id") {
      Axios.put("/profile/edit/" + id, formData)
        .then((data) => {
          this.setState((pre) => ({
            isloading: false,
          }));
          this.props.history.push("/profile");
        })
        .catch((e) => {
          this.setState({
            isloading: false,
            error: {
              ...this.state.error,
              message: e.response.data.message,
              code: e.response.status,
            },
          });
        });
    } else {
      Axios.post("/profile/create", formData)
        .then((data) => {
          this.setState((pre) => ({
            isloading: true,
          }));
          let profile = data.data.profile.username;
          localStorage.setItem(
            "profileData",
            JSON.stringify({
              username: profile,
            })
          );
          this.props.history.push("/");
        })
        .catch((e) => {
          this.setState({
            isloading: false,
            error: {
              ...this.state.error,
              message: e.response.data.message,
              code: e.response.status,
            },
          });
        });
    }
    this.setState({
      Post: { ...this.state.Post, username: "", bio: "", imagePath: "" },
    });
  }
  render() {
    let isLoading;
    let iserror;

    if (this.state.isloading) {
      isLoading = (
        <>
          <div className="container loading">
            <div className="mar-20">
              <Spinner />
            </div>
          </div>
        </>
      );
    }

    if (this.state.error.code) {
      iserror = (
        <>
          <div className="container error container-short">
            <div className="mar-20">
              <h5>Error Code - {this.state.error.code}</h5>
              <h4>Error Message - {this.state.error.message}</h4>
            </div>
          </div>
        </>
      );
    }
    let profile = localStorage.getItem("profileData");
    return (
      <>
        {isLoading}
        {iserror}
        <div className="container container-short">
          <form onSubmit={this.mySubmitHandler} className="pt-4">
            <h3 className="text-center mb-3">
              {profile ? "Редактировать профиль" : "Создать профиль"}
            </h3>
            <div className="form-group">
              <label htmlFor="username">Имя пользователя </label>
              <input
                type="username"
                name="username"
                value={this.state.Post.username}
                className={
                  "form-control " +
                  (this.state.errors.username ? "is-invalid" : "")
                }
                placeholder="Введите имя пользователя"
                required
                onChange={this.myChangeHandler}
              />

              {this.profileData("clear_button") ? (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                >
                  Очистить
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    this.setState({
                      Post: {
                        ...this.state.Post,
                        username: "",
                      },
                    });
                  }}
                >
                  Очистить
                </button>
              )}
              {this.state.errors.username.length > 0 && (
                <div className="mt-1">
                  <span className="error text-danger">
                    {this.state.errors.username}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="Bio">О себе </label>
              {this.profileData("required_field_error") ? (
                <textarea
                  type="text"
                  name="bio"
                  rows="4"
                  value={this.state.Post.bio}
                  className={"form-control"}
                  placeholder="Введите описание"
                  onChange={this.myChangeHandler}
                />
              ) : (
                <textarea
                  type="text"
                  name="bio"
                  rows="4"
                  required
                  value={this.state.Post.bio}
                  className={
                    "form-control " +
                    (this.state.errors.bio ? "is-invalid" : "")
                  }
                  placeholder="Введите описание"
                  onChange={this.myChangeHandler}
                />
              )}

              {this.profileData("clear_button") ? (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                >
                  Очистить
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    this.setState({
                      Post: {
                        ...this.state.Post,
                        bio: "",
                      },
                    });
                  }}
                >
                  Очистить
                </button>
              )}

              {this.state.errors.bio.length > 0 && (
                <div className="mt-1">
                  <span className="error text-danger">
                    {this.state.errors.bio}
                  </span>
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password">Изображение </label>
              <ImageUpload
                label="Выбрать"
                id="imagePath"
                name="imagePath"
                onInput={this.imageHandler}
                value={this.state.Post.imagePath}
                errorText="Пожалуйста выберите изображение"
              />
              {this.state.Post.imagePath === "" && (
                <div className="mt-1">
                  <span className="error text-danger">
                    {this.state.errors.imagePath}
                  </span>
                </div>
              )}
            </div>
            <div className="form-group">
              <button
                style={{ marginRight: "15px" }}
                type="submit"
                className="btn btn-primary"
                disabled={
                  this.state.Post.username && this.state.Post.bio //&& this.state.Post.imagePath
                    ? ""
                    : "disabled"
                }
              >
                Сохранить изменения
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }
}

export default CreatePost;
