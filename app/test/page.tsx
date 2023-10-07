"use client";

import React, { Component } from 'react';
import Style from './style.module.css'; // Подключаем файл стилей

interface MenuState {
  selectedOption: string | null;
  selectedOptionIndex: number | null;
}

class Menu extends Component<{}, MenuState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      selectedOption: null,
      selectedOptionIndex: null,
    };
  }

  handleOptionClick = (option: string, index: number) => {
    this.setState({
      selectedOption: option,
      selectedOptionIndex: index,
    });
  }

  render() {
    const options = ['Option 1', 'Option 2', 'Option 3'];

    return (
      <div>
        <h1>Выберите опцию:</h1>
        <ul>
          {options.map((option, index) => (
            <li key={index}>
              <a
                href="#"
                onClick={() => this.handleOptionClick(option, index)}
                className={this.state.selectedOptionIndex === index ? Style.selected : ''}
              >
                {option}
              </a>
            </li>
          ))}
        </ul>
        <div className={Style.indicator_container}>
          <div className={Style.indicator} style={{ left: `${this.state.selectedOptionIndex * 100}px` }}></div>
        </div>
        <p>Выбрано: {this.state.selectedOption}</p>
      </div>
    );
  }
}

export default Menu;


