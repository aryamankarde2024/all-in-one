import connection from "../connection.js";

export default (req, res) => {
  new Promise((resolve, reject) => {
    if (req.query?.q) {
      req.query.q = req.query.q.toLowerCase();
      connection.query(
        `select count(1) as total from ${
          req.query.q.split("from")[1].split("limit")[0]
        }`,
        function (err, results) {
          if (err) reject(err);
          resolve(results);
        }
      );
    } else {
      resolve({ data: [] });
    }
  })
    .then((data) => {
      new Promise((resolve, reject) => {
        if (req.query?.q) {
          let pageSize;
          let endQuery = req.query.q.split("limit")[0].split(";")[0];
          if ((pageSize = req.query.q.split("limit")[1])) {
            if (pageSize.split(",")[1]) {
              pageSize = pageSize.split(",")[1].split(";")[0];
            } else {
              pageSize = pageSize.split(";")[0];
            }
          } else {
            pageSize = 20;
          }

          const total = Number(data[0].total);
          const currentPage = Number(req.query.p || 1);
          const firstPage = currentPage == 1 ? null : 1;
          const prevPage = currentPage >= 2 ? currentPage - 1 : null;
          const nextPage =
            currentPage < Math.ceil(total / pageSize) ? currentPage + 1 : null;
          const lastPage =
            currentPage < Math.ceil(total / pageSize)
              ? Math.ceil(total / pageSize)
              : null;

          const queryObj = new URLSearchParams(req.query);
          if (queryObj.has("p")) queryObj.delete("p");
          const queryString = "&".concat(queryObj.toString());
          const pathname = "";

          endQuery = `${endQuery} limit ${
            currentPage > 1 ? (currentPage - 1) * pageSize : 0
          }, ${pageSize}`;

          connection.query(endQuery, (err, results, fields) => {
            if (err) reject(err);
            resolve({
              grid: { results, fields },
              pagination: {
                total,
                firstPage,
                prevPage,
                currentPage,
                nextPage,
                lastPage,
                pathname,
                queryString,
              },
              query: req.query.q,
            });
          });
        } else {
          resolve({
            grid: { results: [], fields: [] },
            pagination: { total: 0 },
            query: "",
          });
        }
      })
        .then((data) => res.render("zero-task/home", { data }))
        .catch((err) => {
          console.log(err);
          res.send("Error Fetching Records");
        });
    })
    .catch((err) => {
      console.log(err);
      res.send("Error Fetching Records");
    });
};
