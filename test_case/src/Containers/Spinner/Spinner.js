import React, { Component } from "react";

export class Spinner extends Component {
  render() {
    return (
      <div className="text-center spinner">
        <div className="spinner-border" role="status">
          <span className="sr-only">Загрузка...</span>
        </div>
        <h4>Пожалуйста подождите...</h4>
      </div>
    );
  }
}

export default Spinner;
