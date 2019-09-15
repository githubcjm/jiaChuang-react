import React from 'react'
import { Table, Input, Form } from 'antd';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
    state = {
        editing: false,
    };

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    };

    save = e => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            this.toggleEdit();
            handleSave({ ...record, ...values });
        });
    };

    renderCell = form => {
        this.form = form;
        const { children, dataIndex, record, title } = this.props;
        const { editing } = this.state;
        return editing ? (
            <Form.Item style={{ margin: 0 }}>
                {form.getFieldDecorator(dataIndex, {
                    rules: [
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ],
                    initialValue: record[dataIndex],
                })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
            </Form.Item>
        ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={this.toggleEdit}
                >
                    {children}
                </div>
            );
    };

    render() {
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
                ) : (
                        children
                    )}
            </td>
        );
    }
}

export default class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '测评开始时间',
                dataIndex: 'name',
                width: '20%',
                editable: true,
            },
            {
                title: '测评结束时间',
                dataIndex: 'money',
            },
            {
                title: '评价对象',
                dataIndex: 'address',
            },
            {
                title: '讲师',
                dataIndex: 'operation',

            },
            {
                title: '班主任',
                dataIndex: 'ads',
            },
            {
                title: '就业老师',
                dataIndex: 'typ',
            },
            {
                title: '操作',
                dataIndex: 'people',
            },
        ];

        this.state = {
            contentclass: {
                color: 'black',
                textAlign: 'center',
                fontSize: ' 23px'
            },
            dataSource: [],
            dataSources: [],
            count: 2,
        };
    }

    handleDelete = key => {
        const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
    };

    handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: 32,
            address: `London, Park Lane no. ${count}`,
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    };

    handleSave = row => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({ dataSource: newData });
    };

    render() {
        const { dataSource } = this.state;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        return (
            <div style={this.state.contentclass}>
                <div style={{
                    margin: '0 0 12px',
                    borderBottom: '1px dotted #e2e2e2',
                    paddingBottom: '16px',
                    paddingTop: ' 7px'
                }}>
                    <div style={{
                        color: '#468847',
                        backgroundColor: '#dff0d8',
                        borderColor: '#d6e9c6',
                        padding: '15px',
                        marginBottom:' 20px',
                        border:' 1px solid transparent',
                        fontSize:'20px'
                    }}>
                        <i class="icon-ok green"></i>
                        您的满意是对我们最好的评价，您的批评是给我们最大的改进动力，欢迎同学对千锋提出宝贵的批评和建议。
                        </div>
                </div>
                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                />
            </div >
        );
    }
    componentDidMount() {
        console.log(this.columns);

    }
}