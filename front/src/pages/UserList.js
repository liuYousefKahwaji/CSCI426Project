import '../styles/UserList.css';
import { useState, useContext } from 'react';
import ThemeContext from '../context/ThemeContext';
import axios from 'axios';

function UserList({ userList, setUserList, replaceUser, fetchUsers }) {
    const [selected, setSelected] = useState([]);
    const { theme } = useContext(ThemeContext);

    // toggle single select
    const toggleSelect = (index) => {
        if (userList[index].admin) return;
        if (selected.includes(index)) {
            setSelected(selected.filter(i => i !== index));
        } else {
            setSelected([...selected, index]);
        }
    };

    // toggle all
    const toggleSelectAll = () => {
        const nonAdminIndices = userList.map((u, i) => (!u.admin ? i : null)).filter(i => i !== null);
        if (selected.length === nonAdminIndices.length) {
            setSelected([]);
        } else {
            setSelected(nonAdminIndices);
        }
    };

    // delete selected users
    const deleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/userlist/${id}`);
            await fetchUsers();
        }
        catch (err) {
            console.log(err);
        }
    };
    const deleteSelected = async () => {
        if (selected.length === 0) return;
        if (!window.confirm(`Delete ${selected.length} user(s)?`)) return;
        try {
            const userIds = selected.map(index => userList[index].id);
            await Promise.all(userIds.map(id => deleteUser(id)));
            setSelected([]);
        } catch (e) {
            console.log("Error deleting user(s).")
        }
    };

    const selectCount = selected.length;
    const nonAdminCount = userList.filter(u => !u.admin).length;

    return (
        <div className={"user-list " + theme}>
            <h1>User List (Admin Only)</h1>
            <ul className="user-controls">
                <li> <button
                    className="btn-select-all"
                    onClick={toggleSelectAll}
                    disabled={nonAdminCount === 0}
                >
                    {selectCount === nonAdminCount && nonAdminCount > 0 ? 'Deselect All' : 'Select All'}
                </button></li>
                <li>
                    <span className="selection-count">
                        {selectCount} selected
                    </span></li>
                <li><button
                    className="btn-delete-selected"
                    onClick={deleteSelected}
                    disabled={selectCount === 0}
                >
                    Delete Selected
                </button></li>
            </ul>
            <table className="user-table" align='center'>
                <thead>
                    <tr>
                        <th className="checkbox-col">
                            <input
                                type="checkbox"
                                checked={selectCount === nonAdminCount && nonAdminCount > 0}
                                onChange={toggleSelectAll}
                                disabled={nonAdminCount === 0}
                            />
                        </th>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Privileges</th>
                        <th>Wallet</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        userList.map((user, index) => (
                            <tr key={index} className={selected.includes(index) ? 'selected' : ''}>
                                <td className="checkbox-col">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(index)}
                                        onChange={() => toggleSelect(index)}
                                        disabled={user.admin}
                                    />
                                </td>
                                <td>{user.name}</td>
                                <td>{user.pass}</td>
                                <td>{user.admin ? 'Admin' : 'User'}</td>
                                <td><button style={{ padding: '8px 10px', width: '35%' }} disabled={user.admin} onClick={() => {
                                    const newVal = parseFloat(prompt("Enter new Wallet value: "))
                                    if (!newVal || newVal < 0) return;
                                    const changedUser = { ...user, wallet: newVal };
                                    replaceUser(changedUser,false);
                                }}>{user.wallet.toFixed(2)}$</button></td>
                                <td>
                                    <button
                                        style={{ background: user.admin ? 'gray' : 'red', color: 'white' }}
                                        disabled={user.admin}
                                        onClick={() => {
                                            deleteUser(user.id);
                                            const adjusted = selected
                                                .filter(i => i !== index)
                                                .map(i => (i > index ? i - 1 : i));
                                            setSelected(adjusted);
                                        }}>
                                        {user.admin ? 'Admin' : 'Delete'}
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}
export default UserList;