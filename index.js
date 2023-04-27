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

//   const fetchUsers = async () => {
//     const baseUrl = "https://jsonplaceholder.typicode.com";
//     const userIds = [1, 2, 3];

//     // 1. Створюємо масив промісів
//     const arrayOfPromises = userIds.map(async userId => {
//       const response = await fetch(`${baseUrl}/users/${userId}`);
//       return response.json();
//     });

//     // 2. Запускаємо усі проміси паралельно і чекаємо на їх завершення
//     const users = await Promise.all(arrayOfPromises);
//     console.log(users);
//   };

//   fetchUsers();

const searchForm = document.querySelector('.js-search');
const addCountry = document.querySelector('.js-add');
const list = document.querySelector('.js-list');
const formContainer = document.querySelector('.js-form-container');

addCountry.addEventListener('click', handlerAddInput);
searchForm.addEventListener('submit', handlerForm);

function handlerAddInput() {
	const markUp = `<input type="text" name="country">`;
	formContainer.insertAdjacentHTML('beforeend', markUp);
}

function handlerForm(event) {
	event.preventDefault();
	const data = new FormData(event.currentTarget);
	const arr = data
		.getAll('country')
		.filter(country => country)
		.map(country => country.trim());
	getCountries(arr)
		.then(async resp => {
			const capitals = resp.map(({ capital }) => capital[0]);
			const weatherService = await getWeather(capitals);
            console.log(weatherService)
			list.innerHTML = createMarkUp(weatherService)
		})
		.catch(error => console.log(error));
}

async function getCountries(arr) {
	const BASE_URL = 'https://restcountries.com/v3.1/name/';
	const responses = arr.map(async country => {
		const response = await fetch(`${BASE_URL}${country}`);
		if (!response.ok) {
			throw new Error();
		}
		return response.json();
	});
	const data = await Promise.allSettled(responses);
	const countryObj = data
		.filter(({ status }) => status === 'fulfilled')
		.map(({ value }) => value[0]);
	return countryObj;
}

async function getWeather(arr) {
	const BASE_URL = 'http://api.weatherapi.com/v1';
	const API_KEY = 'ce2cb9b2a3da414bb5b172546231704';

	const resps = arr.map(async city => {
		const params = new URLSearchParams({
			key: API_KEY,
			q: city,
			lang: 'uk',
		});

		const resp = await fetch(`${BASE_URL}/current.json?${params}`);

		if (!resp.ok) {
			throw new Error(resp.statusText);
		}

		return resp.json();
	});

	const data = await Promise.allSettled(resps);
	const objs = data.filter(({ status }) => status === 'fulfilled').map(({ value }) => value);

	return objs;
}

function createMarkUp(arr) {
	return arr
		.map(
			({  location: { name, country }, current:{temp_c, condition:{text, icon}} }) => `<li>
    <div>
        <h3>${country}</h3>
        <h2>${name}</h2>
    </div>
    <img src="${icon}" alt="${name}">
    <p>${temp_c}°</p>
    <p>${text}</p>  
   </li>`
		)
		.join('');
}
