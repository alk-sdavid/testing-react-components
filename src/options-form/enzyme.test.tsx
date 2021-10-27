import { fireEvent, render, screen } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, shallow } from 'enzyme';
import React from 'react';

configure({ adapter: new Adapter() });

interface Props {
  onChange: () => void;
}
interface State {
  checked: boolean;
}
class MyComponent extends React.Component<Props, State> {
  state = { checked: false };
  onChange = () => {
    this.props.onChange();
    this.setState((state) => ({ ...state, checked: !state.checked }));
  };
  render() {
    return (
      <input
        type="checkbox"
        onChange={this.onChange}
        checked={this.state.checked}
      ></input>
    );
  }
}

test('click implementation', () => {
  const onChange = jest.fn();
  const wrapper = shallow<MyComponent, Props, State>(
    <MyComponent onChange={onChange} />,
  );
  wrapper.instance().onChange();
  expect(onChange).toHaveBeenCalledTimes(1);
});

test('click interaction', () => {
  const onChange = jest.fn();
  render(<MyComponent onChange={onChange} />);
  fireEvent.click(screen.getByRole('checkbox'));
  expect(onChange).toHaveBeenCalledTimes(1);
});

test('state update', () => {
  const wrapper = shallow<MyComponent, Props, State>(
    <MyComponent onChange={() => {}} />,
  );
  expect(wrapper.find({ type: 'checkbox' }).props().checked).toEqual(false);
  wrapper.setState({ checked: true });
  expect(wrapper.find({ type: 'checkbox' }).props().checked).toEqual(true);
});

test('selected checkbox', () => {
  const onChange = jest.fn();
  render(<MyComponent onChange={onChange} />);
  expect(screen.getByRole('checkbox')).not.toBeChecked();
  fireEvent.click(screen.getByRole('checkbox'));
  expect(screen.getByRole('checkbox')).toBeChecked();
});
