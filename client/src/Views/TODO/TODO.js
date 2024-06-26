import { useEffect, useState } from "react";
import Styles from "./TODO.module.css";
//import { dummy } from "./dummy";
import axios from "axios";

export function TODO(props) {
	const [newTodoTitle, setNewTodoTitle] = useState("");
	const [newTodoDesc, setNewTodoDesc] = useState("");
	const [todoData, setTodoData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editTodoId, setEditTodoId] = useState(null);
	const [editTitle, setEditTitle] = useState("");
	const [editDescription, setEditDesctiption] = useState("");

	useEffect(() => {
		const fetchTodo = async () => {
			const apiData = await getTodo();
			setTodoData(apiData);
			setLoading(false);
		};
		fetchTodo();
	}, []);

	const getTodo = async () => {
		const options = {
			method: "GET",
			url: `http://localhost:8000/api/todo`,
			headers: {
				accept: "application/json",
			},
		};
		try {
			const response = await axios.request(options);
			return response.data;
		} catch (error) {
			console.log(error);
			return [];
		}
	};

	const addTodo = () => {
		const options = {
			method: "POST",
			url: `http://localhost:8000/api/todo`,
			headers: {
				accept: "application/json",
			},
			data: {
				title: newTodoTitle,
				description: newTodoDesc,
			},
		};
		axios
			.request(options)
			.then(function (response) {
				console.log(response.data);
				setTodoData([...todoData, response.data.newTodo]);
				setNewTodoTitle("");
				setNewTodoDesc("");
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const deleteTodo = (id) => {
		const options = {
			method: "DELETE",
			url: `http://localhost:8000/api/todo/${id}`,
			headers: {
				accept: "application/json",
			},
		};
		axios
			.request(options)
			.then(function (response) {
				console.log(response.data);
				setTodoData((prevData) =>
					prevData.filter((todo) => todo._id !== id)
				);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const updateTodo = (id, updatedData) => {
		const options = {
			method: "PATCH",
			url: `http://localhost:8000/api/todo/${id}`,
			headers: {
				accept: "application/json",
			},
			data: updatedData,
		};
		axios
			.request(options)
			.then(function (response) {
				console.log(response.data);
				setTodoData((prevData) =>
					prevData.map((todo) =>
						todo._id === id ? response.data : todo
					)
				);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<div className={Styles.ancestorContainer}>
			<div className={Styles.headerContainer}>
				<h1>Tasks</h1>
				<span>
					<input
						className={Styles.todoInput}
						type="text"
						name="New Todo Ttile"
						placeholder="Todo Ttitle"
						value={newTodoTitle}
						onChange={(event) => {
							setNewTodoTitle(event.target.value);
						}}
					/>
					<input
						className={Styles.todoInput}
						type="text"
						name="New Todo Description"
						placeholder="Todo Description"
						value={newTodoDesc}
						onChange={(event) => {
							setNewTodoDesc(event.target.value);
						}}
					/>
					<button
						id="addButton"
						name="add"
						className={Styles.addButton}
						onClick={() => {
							addTodo();
							setNewTodoTitle("");
							setNewTodoDesc("");
						}}
					>
						+ New Todo
					</button>
				</span>
			</div>
			<div id="todoContainer" className={Styles.todoContainer}>
				{loading ? (
					<p style={{ color: "white" }}>Loading...</p>
				) : todoData.length > 0 ? (
					todoData.map((entry, index) => (
						<div key={entry._id} className={Styles.todo}>
							<span className={Styles.infoContainer}>
								<input
									type="checkbox"
									checked={entry.done}
									onChange={() => {
										updateTodo(entry._id, {
											done: !entry.done,
										});
									}}
								/>
								{editTodoId === entry._id ? (
									<input
										type="text"
										value={editTitle}
										onChange={(e) =>
											setEditTitle(e.target.value)
										}
										style={{
											width: "500px",
											height: "35px",
											fontSize: "large",
											margin: "10px",
										}}
									/>
								) : (
									entry.title
								)}
								{editTodoId === entry._id ? (
									<input
										type="text"
										value={editDescription}
										placeholder="Description"
										onChange={(e) =>
											setEditDesctiption(e.target.value)
										}
										style={{
											display: "block",
											width: "500px",
											height: "35px",
											fontSize: "medium",
											marginLeft: "38px",
										}}
									/>
								) : (
									<div style={{ whiteSpace: "pre-wrap" }}>
										Description: {entry.description}
									</div>
								)}
							</span>
							<span
								style={{ cursor: "pointer" }}
								onClick={() => {
									if (editTodoId === entry._id) {
										updateTodo(entry._id, {
											title: editTitle,
											description: editDescription,
										});
										setEditTodoId(null);
										setEditTitle("");
										setEditDesctiption("");
									} else {
										setEditTodoId(entry._id);
										setEditTitle(entry.title);
										setEditDesctiption(entry.description);
									}
								}}
							>
								{editTodoId === entry._id ? "Save" : "Edit"}
							</span>
							<span
								style={{ cursor: "pointer" }}
								onClick={() => {
									deleteTodo(entry._id);
								}}
							>
								Delete
							</span>
						</div>
					))
				) : (
					<p className={Styles.noTodoMessage}>
						No tasks available. Please add a new task.
					</p>
				)}
			</div>
		</div>
	);
}
