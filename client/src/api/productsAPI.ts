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