import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiConfig from "./client/endpoint";
import api from "./client/webClient";

export const  useGetProductsAPI = async () => {
	const url = apiConfig.GET.GET_PRODUCTS;

	const getProducts = await api
		.get(url, {
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then(
			(resp) => {
				let response = resp.data;
				return response;
			},
			(error) => {
				console.log(error);
				throw error;
			}
		);

	return getProducts;
};

export const  useGetAllCategoriesAPI = async  () => {
	const url = apiConfig.GET.GET_CATEGORIES;

	// const getCategories = useQuery<void, null>(
	// 	["get_categories_api"],
	// 	() =>
	// 		api
	// 			.get(apiConfig.GET.GET_CATEGORIES, {
	// 				headers: {
	// 					"Content-Type": "application/json",
	// 				},
	// 			})
	// 			.then(
	// 				(resp) => {
	// 					let response = resp.data;
	// 					return response;
	// 				},
	// 				(error) => {
	// 					// console.log(error);
	// 					throw error;
	// 				}
	// 			),
	// 	{
	// 		onSuccess: (res) => {
	// 			// console.log(res);
	// 		},
	// 		onError: (res) => {
	// 			// const errorMessage = res.response ? res.response.data.description : "Oops.. Error to get devices. Try again!";
	// 			toast.error("Oops.. Error to get devices. Try again!");
	// 		},
	// 	}
	// );


	const getCategories =  api
		.get(url, {
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then(
			(resp) => {
				let response = resp;
				return response;
			},
			(error) => {
				console.log(error);
				throw error;
			}
		);

	return getCategories;
};