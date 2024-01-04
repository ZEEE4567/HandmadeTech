function ProductService(ProductModel) {
  let service = {
    create,
    findAll,
    findProductsByCategory,
    update,
    removeById,
  };

  function create(product) {
    let newProduct = ProductModel(product);
    return save(newProduct);
  }

  function save(model) {
    return new Promise(function (resolve, reject) {
      model.save(function (err) {
        if (err) reject("There is a problem with registering the product");

        resolve({
          message: "Product Created",
          product: model,
        });
      });
    });
  }

  async function findAll(pagination) {
    const { limit, skip } = pagination;

    const products_1 = await new Promise(function (resolve, reject) {
          ProductModel.find({}, {}, { skip, limit }, function (err, products) {
              if (err) reject(err);

              resolve(products);
          });
      });
      const totalProducts = await ProductModel.count();
      return await Promise.resolve({
          data: products_1,
          pagination: {
              pageSize: limit,
              page: Math.floor(skip / limit),
              hasMore: skip + limit < totalProducts,
              total: totalProducts,
          },
      });
  }

  function findProductsByCategory(category) {
    return new Promise(function (resolve, reject) {
      ProductModel.find({ category }, function (err, products) {
        if (err) reject(err);

        if (!products || products.length === 0) {
          reject("Products not found for the given category");
        }

        resolve(products);
      });
    });
  }

  function update(id, product) {
    return new Promise(function (resolve, reject) {
      ProductModel.findByIdAndUpdate(
        id,
        product,
        function (err, productUpdated) {
          if (err) reject("Product update failed");
          resolve(productUpdated);
        }
      );
    });
  }

  function removeById(id) {
    return new Promise(function (resolve, reject) {
      ProductModel.findByIdAndRemove(id, function (err) {
        if (err)
          reject({
            message: "Unable to remove product",
          });

        resolve();
      });
    });
  }

  return service;
}

module.exports = ProductService;
