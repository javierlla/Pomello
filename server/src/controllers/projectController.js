import projectModel from "../models/projectModel.js";
import userModel from "../models/userModel.js";
import Errors from "../utils/errors.js"; // ✅ Importamos el default

import listModel from "../models/listModel.js";
import taskModel from "../models/taskModel.js";

// ✅ Destructuramos solo los errores que usamos
const {
  ProjectTitleNotProvided,
  ProjectDescriptionNotProvided,
  ProjectNotFound,
  UserNotFound
} = Errors;


/**
 * Creates a new project and assigns it to the authenticated user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @throws {ProjectTitleNotProvided} - If the title is not provided.
 * @returns {Promise<void>} Resolves when the project is created and the user is assigned.
 */
const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      throw new ProjectTitleNotProvided();
    }

    const projectData = {
      title,
      description,
      user: req.user.id, // Asegúrate de que el usuario autenticado esté asignado
    };

    const projectCreated = await projectModel.create(projectData);
    res.status(201).json(projectCreated);
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

/**
 * Returns all projects in the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @throws {Error} - If the operation fails.
 * @returns {Promise<void>} Resolves when the projects are retrieved.
 */
const getProjects = async (req, res) => {
  try {
    const projects = await projectModel.find();
    res.json(projects);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

/**
 * Returns a single project by ID, with all its lists and tasks.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @throws {ProjectNotFound} - If the project does not exist.
 * @returns {Promise<void>} Resolves when the project is retrieved.
 */
const getProjectbyId = async (req, res) => {
  try {
    const projectId = req.params.id.trim();

    const project = await projectModel.findById(projectId);
    if (!project) {
      throw new ProjectNotFound();
    }

    const lists = await listModel.find({ project: projectId });

    const listIds = lists.map((list) => list._id);
    const tasks = await taskModel.find({ list: { $in: listIds } });

    const listsWithTasks = lists.map((list) => {
      const listTasks = tasks.filter(
        (task) => task.list.toString() === list._id.toString()
      );
      return {
        ...list.toObject(),
        tasks: listTasks,
      };
    });

    // devolver el proyecto con listas y tareas
    const projectWithListsAndTasks = {
      ...project.toObject(),
      lists: listsWithTasks,
    };

    res.json(projectWithListsAndTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Returns all projects associated with the authenticated user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @throws {UserNotFound} - If the user is not found.
 * @returns {Promise<void>} Resolves when the projects are retrieved.
 */
const getProjectsByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      throw new Errors.UserNotFound();
    }

    const projects = await projectModel.find({ user: userId });

    if (!projects.length) {
      return res.status(200).json([]);
    }

    res.json(projects);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

/**
 * Returns all projects, lists and tasks associated with the specified user ID.
 * @param {Object} req - The request object. Must include the user ID in params.
 * @param {Object} res - The response object.
 * @throws {UserNotFound} - If the user is not found.
 * @returns {Promise<void>} Resolves when the user data is retrieved.
 */
const getFullUserData = async (req, res) => {
  try {
    const userId = req.params.userId.trim();

    const projects = await projectModel.find({ user: userId });

    const projectIds = projects.map((project) => project._id);
    const lists = await listModel.find({ project: { $in: projectIds } });

    const listIds = lists.map((list) => list._id);
    const tasks = await taskModel.find({ list: { $in: listIds } });

    const projectsWithListsAndTasks = projects.map((project) => {
      const projectLists = lists.filter(
        (list) => list.project.toString() === project._id.toString()
      );

      const listsWithTasks = projectLists.map((list) => {
        const listTasks = tasks.filter(
          (task) => task.list.toString() === list._id.toString()
        );
        return {
          ...list.toObject(),
          tasks: listTasks,
        };
      });

      return {
        ...project.toObject(),
        lists: listsWithTasks,
      };
    });

    res.json(projectsWithListsAndTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Updates a project by its ID.
 * @param {Object} req - The request object. Must contain the project ID in the URL parameters
 * and the updated project data in the request body.
 * @param {Object} res - The response object.
 * @throws {ProjectNotFound} - If the project is not found.
 * @returns {Promise<void>} Resolves with the updated project object.
 */
const updateProject = async (req, res) => {
  try {
    // if (req.body.title === '') {
    //     throw new ProjectTitleNotProvided();
    // }

    const projectUpdated = await projectModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!projectUpdated) {
      throw new ProjectNotFound();
    }

    res.json(projectUpdated);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const projectDeleted = await projectModel.findByIdAndDelete(req.params.id);

    if (!projectDeleted) {
      throw new ProjectNotFound();
    }

    res.json(projectDeleted);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export default {
  createProject,
  getProjects,
  getProjectsByUser,
  updateProject,
  deleteProject,
  getProjectbyId,
  getFullUserData,
};
