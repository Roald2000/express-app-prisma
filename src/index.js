const express = require("express");
const cors = require("cors");
const app = express();

const {
  createResponse,
  createError,
  sanitizeData,
  transformDateTime,
} = require("./util");

app.use(cors());
app.use(express.json());

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

//#region //? Authentication Routes

app.get("/user", async (req, res, next) => {
  try {
    const allUser = await prisma.user.findMany({
      include: { person: true },
    });
    allUser.forEach((content) => {
      delete content.password;
      delete content.person.user_id;
      content.person.createdAt = transformDateTime(content.person.createdAt);
      content.person.updatedAt = transformDateTime(content.person.updatedAt);
    });
    res.status(200).json(createResponse(200, allUser));
  } catch (error) {
    next(error);
  }
});

app.post("/user", async (req, res, next) => {
  try {
    const newUser = await prisma.user.create({ data: sanitizeData(req.body) });
    const response = createResponse(201, newUser && "User Created!");
    res.status(response?.status || 201).json(response);
  } catch (error) {
    next(error);
  }
});
//#endregion
//#region  //? Person Routes
app.get("/person", async (req, res, next) => {
  try {
    const allPerson = await prisma.person.findMany({
      include: {
        user: true,
      },
    });
    allPerson.forEach((content) => {
      content.createdAt = transformDateTime(content.createdAt);
      content.updatedAt = transformDateTime(content.updatedAt);
      delete content.user.password;
      delete content.user.u_id;
    });
    res.status(200).json(createResponse(200, allPerson));
  } catch (error) {
    next(error);
  }
});

app.get("/person/search/:search", async (req, res, next) => {
  try {
    const { search } = sanitizeData(req.params);

    const allPerson = await prisma.person.findMany({
      where: {
        OR: [
          { first_name: { contains: search } },
          { last_name: { contains: search } },
          { middle_name: { contains: search } },
          { user: { username: { contains: search } } },
        ],
      },
      include: {
        user: true,
      },
    });

    allPerson.forEach((content) => {
      content.createdAt = transformDateTime(content.createdAt);
      content.updatedAt = transformDateTime(content.updatedAt);
      delete content.user.password;
      delete content.user.u_id;
    });

    res.status(200).json(createResponse(200, allPerson));
  } catch (error) {
    next(error);
  }
});

app.post("/person", async (req, res, next) => {
  try {
    const newPerson = await prisma.person.create({
      data: sanitizeData(req.body),
    });
    const response = createResponse(201, newPerson && "Person Created!");
    res.status(response?.status || 201).json(response);
  } catch (error) {
    next(error);
  }
});

app.put("/person/:p_id", async (req, res, next) => {
  try {
    const { p_id } = sanitizeData(req.params);

    const newPerson = await prisma.person.update({
      where: { p_id: parseInt(p_id) },
      data: sanitizeData(req.body),
    });
    const response = createResponse(201, newPerson && "Person Updated!");
    res.status(response?.status || 201).json(response);
  } catch (error) {
    next(error);
  }
});

app.delete("/person/:p_id", async (req, res, next) => {
  try {
    const { p_id } = sanitizeData(req.params);

    const deletePerson = await prisma.person.delete({
      where: { p_id: parseInt(p_id) },
    });
    deletePerson && res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

//#endregion

app.use((req, res, next) => {
  const err = new Error("Invalid Route");
  const newErr = Object.assign(err, { status: 404 });
  next(newErr);
});

app.use((error, req, res, next) => {
  console.log(error);
  res
    .status(error.status || 500)
    .send(
      { ...error, message: error.message } || { error: "Internal Server Error" }
    );
});

app.listen(3030, () => console.log(`Server @ http://localhost:${3030}`));
