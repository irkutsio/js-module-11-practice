
// const postId = 1;

// fetch("https://jsonplaceholder.typicode.com/posts/${postId}")
//   .then(response => response.json())
//   .then(posts => console.log(posts))
//   .catch(error => console.log(error))

//   const postToAdd = {
//     author: "Mango",
//     body: "CRUD is awesome",
//   };
  
//   const options = {
//     method: "POST",
//     body: JSON.stringify(postToAdd),
//     headers: {
//       "Content-Type": "application/json; charset=UTF-8",
//     },
//   };
  
//   fetch("https://jsonplaceholder.typicode.com/posts", options)
//     .then(response => response.json())
//     .then(post => console.log(post))
//     .catch(error => console.log(error));


      const fetchUsers = async () => {
        const baseUrl = "https://jsonplaceholder.typicode.com";
        const userIds = [1, 2, 3];
      
        // 1. Створюємо масив промісів
        const arrayOfPromises = userIds.map(async userId => {
          const response = await fetch(`${baseUrl}/users/${userId}`);
          return response.json();
        });
      
        // 2. Запускаємо усі проміси паралельно і чекаємо на їх завершення
        const users = await Promise.all(arrayOfPromises);
        console.log(users);
      };
      
      fetchUsers();