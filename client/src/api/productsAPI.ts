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
type category={
	CAT_ID:number,
	CAT_NAME:string,
	PROD_IMG:string
  }
export const useCategoriesAPI=async ():Promise<category[]>=>{
	const url=apiConfig.POST.CATEGORIES;
	try{
		const categories=await api.post("/products/getcategories",{sort:"asc"});
		if(categories.data.status==="success"){
			return categories.data.categories;
		}
		else{
			return [];
		}
	}catch(error){
		console.log(error);
		return [];
	}
}
export const useBestSellersAPI=async ():Promise<any[]>=>{
	// =>/products/getproducts=>{filterType:string (all,bestSellers,byCategoryId,byProductId),filterValue:string,sortby:{fieldName:'asc' || 'desc'},limit:{from:,to}}
	const url=apiConfig.POST.PRODUCTS;
	try{
		const response=await api.post(url,{filterType:"bestSellers"});
		
		if(response.data.status==="success"){
			
			return response.data.products;
		}
		else{
			return [];
		}
	}catch(error){
		console.log(error);
		return [];
	}
}
export const useGetProductsByCategoryAPI=async (categoryId:any):Promise<any[]>=>{
	// =>/products/getproducts=>{filterType:string (all,bestSellers,byCategoryId,byProductId),filterValue:string,sortby:{fieldName:'asc' || 'desc'},limit:{from:,to}}
	const url=apiConfig.POST.PRODUCTS;
	try{
		const response=await api.post(url,{filterType:"byCategoryId",filterValue:categoryId});
		if(response.data.status==="success"){
			return response.data.products;
		}
		else{
			return [];
		}
	}catch(error){
		console.log(error);
		return [];
	}
}