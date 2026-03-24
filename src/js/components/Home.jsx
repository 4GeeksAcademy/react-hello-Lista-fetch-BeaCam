import React, { useEffect, useState } from "react";

const API_TODO = "https://playground.4geeks.com/todo";
const USER = "beatriz24BCN";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    label: ""
  });

  useEffect(() => {
    obtenerTareas();
  }, []);

  const obtenerTareas = () => {
    fetch(`${API_TODO}/users/${USER}`)
      .then((response) => {
        if (!response.ok) {
          return crearUsuario().then(() => obtenerTareas());
        }
        return response.json();
      })
      .then((data) => {
        if (data) setTasks(data.todos || []);
      })
      .catch((error) => console.log(error));
  };

  const crearUsuario = () => {
    return fetch(`${API_TODO}/users/${USER}`, {
      method: "POST"
    });
  };

  const crearTarea = (tarea) => {
    fetch(`${API_TODO}/todos/${USER}`, {
      method: "POST",
      body: JSON.stringify({
        label: tarea.label,
        is_done: false
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(() => {
        obtenerTareas();
        setForm({ label: "" });
      })
      .catch((error) => console.log(error));
  };

  const eliminarTarea = (id) => {
    fetch(`${API_TODO}/todos/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setTasks((tareas) =>
          tareas.filter((tarea) => tarea.id !== id)
        );
      })
      .catch((error) => console.log(error));
  };

  const limpiarTareas = () => {
    fetch(`${API_TODO}/users/${USER}`, {
      method: "DELETE"
    })
      .then(() => {
        setTasks([]);
        crearUsuario();
      })
      .catch((error) => console.log(error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    crearTarea(form);
  };

  const handleChange = (e) => {
    setForm({ label: e.target.value });
  };

  return (
    <div className="container">
      <h1>📝 Todo List</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nueva tarea"
          value={form.label}
          onChange={handleChange}
          required
        />
        <button>Agregar</button>
      </form>

      <ul>
        {tasks.map((tarea) => (
          <li key={tarea.id}>
            {tarea.label}
            <button onClick={() => eliminarTarea(tarea.id)}>
              ❌
            </button>
          </li>
        ))}
      </ul>

      <button onClick={limpiarTareas}>🧹 Limpiar todo</button>
    </div>
  );
};

export default Home;