const fs = require("fs").promises;

class Container {
  constructor(path) {
    this.path = path;
  }

  async save(obj) {
    try {
      const leer = await fs.readFile(this.path, "utf-8");
      let data = JSON.parse(leer);
      let id;
      if (obj.id) {
        id = obj.id;
      } else {
        if (data.length == 0) {
          id = 1;
        } else {
          id = data.length + 1;
        }
      }
      const newObj = { ...obj, id };
      data.push(newObj);
      await fs.writeFile(this.path, JSON.stringify(data, null, 2), "utf-8");
      return newObj.id;
    } catch (error) {
      console.log(error);
    }
  }

  async remplace(productModifi, index) {
    try {
      const leer = await fs.readFile(this.path, "utf-8");
      let data = JSON.parse(leer);

      data[index] = productModifi;
      await fs.writeFile(this.path, JSON.stringify(data, null, 2), "utf-8");
    } catch (error) {
      const errorMsg = "no se pudo actualizar el objeto";
      return errorMsg;
    }
  }

  async getAll(req, res) {
    try {
      const all = await fs.readFile(this.path, "utf-8");
      return JSON.parse(all);
    } catch (error) {
      const errorMsg = "no se encontraron resultados";
      return errorMsg;
    }
  }

  async getById(id) {
    try {
      const leer = await fs.readFile(this.path, "utf-8");
      let data = JSON.parse(leer);
      const obj = data.find((obj) => obj.id === id);
      if (!obj) {
        return obj;
      } else {
        return obj;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteAll() {
    try {
      await fs.writeFile(this.path, JSON.stringify([]), "utf-8");
    } catch (error) {
      console.log(error);
    }
  }

  async deleteById(id) {
    try {
      const leer = await fs.readFile(this.path, "utf-8");
      let data = JSON.parse(leer);
      const obj = data.filter((obj) => obj.id !== id);

      if (!obj) {
        return null;
      }
      data.push(obj);
      await fs.writeFile(this.path, JSON.stringify(obj, null, 2), "utf-8");
      return obj;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Container;
