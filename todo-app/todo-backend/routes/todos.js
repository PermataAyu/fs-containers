const express = require('express');
const { Todo } = require('../mongo')
const redis = require('../redis')
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  const count = await redis.get("key")
  const add = Number(count) ? Number(count) + 1 : 1
  await redis.set("key", add)
  const value = await redis.get("key")

  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await Todo.deleteOne({_id: req.todo.id}) 
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo)
  // res.sendStatus(200); // Implement this
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const todo = await Todo.findById(req.todo)
  todo.text = req.body.text
  todo.done = req.body.done
  const updatedtodo = await todo.save()
  res.send(updatedtodo)
  //res.sendStatus(405); // Implement this
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
