/** @format */

import React from 'react';

import { View, Modal, Text, ScrollView, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import BaseComponent from './BaseComponent';
import styles from './style';

let componentIndex = 0;

const defaultProps = {
  data: [],
  onChange: () => {},
  initValue: 'Select me!',
  style: {},
  selectStyle: {},
  optionStyle: {},
  optionTextStyle: {},
  sectionStyle: {},
  sectionTextStyle: {},
  cancelStyle: {},
  cancelTextStyle: {},
  overlayStyle: {},
  cancelText: 'cancel',
};

export default class ModalPicker extends BaseComponent {
  constructor(props) {
    super(props);

    this._bind('onChange', 'open', 'close', 'renderChildren');

    this.state = {
      animationType: 'slide',
      modalVisible: false,
      transparent: false,
      selected: props.initValue || 'please select',
      cancelText: props.cancelText,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.initValue != this.props.initValue) {
      this.setState({ selected: nextProps.initValue });
    }
  }

  onChange = item => {
    this.props.onChange(item);
    this.setState({ selected: item.label });
    this.close();
  };

  close = () => {
    this.setState({
      modalVisible: false,
    });
  };

  open = () => {
    this.setState({
      modalVisible: true,
    });
  };

  renderSection = section => {
    return (
      <View
        key={section.key}
        style={[styles.sectionStyle, this.props.sectionStyle]}
      >
        <Text style={[styles.sectionTextStyle, this.props.sectionTextStyle]}>
          {section.label}
        </Text>
      </View>
    );
  };

  renderOption = option => {
    return (
      <TouchableOpacity key={option.key} onPress={() => this.onChange(option)}>
        <View style={[styles.optionStyle, this.props.optionStyle]}>
          <Text style={[styles.optionTextStyle, this.props.optionTextStyle]}>
            {option.label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderOptionList = () => {
    const options = this.props.data.map(item => {
      if (item.section) {
        return this.renderSection(item);
      }
      return this.renderOption(item);
    });

    return (
      <View
        style={[styles.overlayStyle, this.props.overlayStyle]}
        key={`modalPicker${componentIndex++}`}
      >
        <View style={styles.optionContainer}>
          <ScrollView keyboardShouldPersistTaps="always">
            <View style={{ paddingHorizontal: 10 }}>{options}</View>
          </ScrollView>
        </View>
        <View style={styles.cancelContainer}>
          <TouchableOpacity onPress={this.close}>
            <View style={[styles.cancelStyle, this.props.cancelStyle]}>
              <Text
                style={[styles.cancelTextStyle, this.props.cancelTextStyle]}
              >
                {this.props.cancelText}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderChildren = () => {
    if (this.props.children) {
      return this.props.children;
    }
    return (
      <View style={[styles.selectStyle, this.props.selectStyle]}>
        <Text
          style={[
            styles.selectTextStyle,
            this.props.selectTextStyle,
            this.state.selected == this.props.initValue && { color: '#C7C7C7' },
          ]}
        >
          {this.state.selected}
        </Text>
        <FontAwesome
          name="sort-down"
          size={15}
          color="#b7c4cb"
          style={{ marginTop: -5 }}
        />
      </View>
    );
  };

  render() {
    const dp = (
      <Modal
        transparent
        ref="modal"
        visible={this.state.modalVisible}
        onRequestClose={this.close}
        animationType={this.state.animationType}
      >
        {this.renderOptionList()}
      </Modal>
    );

    return (
      <View style={this.props.style}>
        {dp}
        <TouchableOpacity onPress={this.open} activeOpacity={1}>
          {this.renderChildren()}
        </TouchableOpacity>
      </View>
    );
  }
}

ModalPicker.defaultProps = defaultProps;