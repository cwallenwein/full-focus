import React, { FC, useState } from "react";
import { Card, Checkbox, Col, Row, Switch } from "antd";
import { CloseOutlined, CheckOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import "./App.css";

// TODO: move to extension code, make new popup open when extension icon is clicked
// TODO: initalize state with extension state
// TODO: update extension state

const initialOptions: IOptions = {
  hide_recommendations: true,
  hide_thumbnails: false,
  hide_playlists: false,
  hide_shorts: false,
  hide_sidebar: false,
  hide_comments: false,
  hide_merch: false,
  disable_autoplay: false,
};

const App: FC = () => {
  const [options, setOptions] = useState(initialOptions);
  const [allOptionsActive, setAllOptionsActive] = React.useState(areAllOptionsActive(initialOptions));
  const [someOptionsActive, setSomeOptionsActive] = React.useState(areSomeOptionsActive(initialOptions));

  const onChangeOptionEvent = (id: string) => {
    return (checked: boolean, _event: Event) => {
      const newOptions = { ...options, [id]: checked };
      setOptions(newOptions);
      setAllOptionsActive(areAllOptionsActive(newOptions));
      setSomeOptionsActive(areSomeOptionsActive(newOptions));
    };
  };

  const onToggleAllOptionsEvent = (e: any) => {
    const checked: boolean = e.target.checked;
    let newOptions: IOptions = setAllOptionsTo(options, checked);
    setOptions(newOptions);
    setSomeOptionsActive(false);
    setAllOptionsActive(checked);
  };

  const toggleAllOptionsCheckbox = (
    <Checkbox
      indeterminate={someOptionsActive}
      checked={allOptionsActive}
      onChange={onToggleAllOptionsEvent}
    ></Checkbox>
  );

  return (
    <>
      <Card
        title="Full Focus"
        extra={toggleAllOptionsCheckbox}
        style={{ width: 250 }}
        actions={[<a href="#">More info</a>]}
      >
        <Row gutter={[8, 8]}>
          <Option
            name="Recommendations"
            id="hide_recommendations"
            options={options}
            onChangeOptionEvent={onChangeOptionEvent}
            iconChecked={<EyeInvisibleOutlined />}
            iconUnchecked={<EyeOutlined />}
          />
          <Option
            name="Thumbnails"
            id="hide_thumbnails"
            options={options}
            onChangeOptionEvent={onChangeOptionEvent}
            iconChecked={<EyeInvisibleOutlined />}
            iconUnchecked={<EyeOutlined />}
          />
          <Option
            name="Playlists"
            id="hide_playlists"
            options={options}
            onChangeOptionEvent={onChangeOptionEvent}
            iconChecked={<EyeInvisibleOutlined />}
            iconUnchecked={<EyeOutlined />}
          />
          <Option
            name="YouTube Shorts"
            id="hide_shorts"
            options={options}
            onChangeOptionEvent={onChangeOptionEvent}
            iconChecked={<EyeInvisibleOutlined />}
            iconUnchecked={<EyeOutlined />}
          />
          <Option
            name="Sidebar"
            id="hide_sidebar"
            options={options}
            onChangeOptionEvent={onChangeOptionEvent}
            iconChecked={<EyeInvisibleOutlined />}
            iconUnchecked={<EyeOutlined />}
          />
          <Option
            name="Comments"
            id="hide_comments"
            options={options}
            onChangeOptionEvent={onChangeOptionEvent}
            iconChecked={<EyeInvisibleOutlined />}
            iconUnchecked={<EyeOutlined />}
          />
          <Option
            name="Merchandise"
            id="hide_merch"
            options={options}
            onChangeOptionEvent={onChangeOptionEvent}
            iconChecked={<EyeInvisibleOutlined />}
            iconUnchecked={<EyeOutlined />}
          />
          <Option
            name="Autoplay"
            id="disable_autoplay"
            options={options}
            onChangeOptionEvent={onChangeOptionEvent}
            iconChecked={<CloseOutlined />}
            iconUnchecked={<CheckOutlined />}
          />
        </Row>
      </Card>
    </>
  );
};

const Option: FC<any> = ({ name, id, options, onChangeOptionEvent, iconChecked, iconUnchecked }) => {
  return (
    <>
      <Col span={20}> {name}</Col>
      <Col span={4}>
        <Switch
          onChange={onChangeOptionEvent(id)}
          checkedChildren={iconChecked}
          unCheckedChildren={iconUnchecked}
          checked={options[id]}
        />
      </Col>
    </>
  );
};

const areAllOptionsActive = (options: IOptions) => {
  const optionValues: boolean[] = Object.values(options);
  return optionValues.filter((b) => b).length === optionValues.length;
};

const areNoOptionsActive = (options: IOptions) => {
  return Object.values(options).filter((b) => b).length === 0;
};

const areSomeOptionsActive = (options: IOptions) => {
  return !areAllOptionsActive(options) && !areNoOptionsActive(options);
};

const setAllOptionsTo = (options: IOptions, value: boolean): IOptions => {
  return Object.fromEntries(Object.keys(options).map((key) => [key, value])) as IOptions;
};

type IOptions = {
  hide_recommendations: true;
  hide_thumbnails: false;
  hide_playlists: false;
  hide_shorts: false;
  hide_sidebar: false;
  hide_comments: false;
  hide_merch: false;
  disable_autoplay: false;
};

export default App;
