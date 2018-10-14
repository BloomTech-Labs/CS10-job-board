import React from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { Collapse, Form, Input, Button } from 'antd';

const FormItem = Form.Item;
const Panel = Collapse.Panel;


class AccountUpdate extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
        <div className="form flex column account-change">
            <Collapse className="flex column" bordered={false} accordion={true}>
          
                <Panel className="h4" header="Update Password" key="1">

                  <Form className="form account-change">
                    <FormItem label="Password">
                      {getFieldDecorator('password', {
                        rules: [{
                          required: false, message: 'Please input your password!',
                        }, {
                          validator: this.validateToNextPassword,
                        }],
                      })(
                        <Input type="password" />
                      )}
                    </FormItem>

                    <FormItem label="Confirm Password">
                      {getFieldDecorator('confirm', {
                        rules: [{
                          required: false, message: 'Please confirm your password!',
                        }, {
                          validator: this.compareToFirstPassword,
                        }],
                      })(
                        <Input type="password" onBlur={this.handleConfirmBlur} />
                      )}
                    </FormItem>

                    <Button type="primary" onClick={this.handlePasswordSubmit}>Change Password</Button>
                  </Form>

                </Panel>

                <Panel className="h4" header="Update Account Email" key="2">

                  <Form className="form account-change">

                    <FormItem label="Email">
                      {getFieldDecorator('email', {
                        rules: [{
                          type: 'email', message: 'The input is not a valid email!',
                        }, {
                          required: false, message: 'Please input your email!',
                        }],
                      })(
                        <Input />
                      )}
                    </FormItem>
                    
                    <Button type="primary" onClick={this.handleEmailSubmit}>Change Email</Button>

                  </Form>

                </Panel>
          
          </Collapse>

        </div>
        );
    }
}

export default AccountUpdate = Form.create()(withRouter(AccountUpdate));
