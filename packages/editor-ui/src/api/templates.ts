import { ITemplatesCategory, ITemplatesCollection, ITemplatesQuery, ITemplatesWorkflow, ITemplatesCollectionResponse, ITemplatesWorkflowResponse } from '@/Interface';
import { post, graphql } from './helpers';

export async function getCategories(apiEndpoint: string): Promise<{data: {categories: ITemplatesCategory[]}}> {
	const query = `query {
		categories: getTemplateCategories {
			id
			name
		}
	}`;
	return await post(apiEndpoint, `/graphql`, { query });
}

export async function getCollections(apiEndpoint: string, query: ITemplatesQuery): Promise<{data: {collections: ITemplatesCollection[]}}> {
	const gqlQuery = `query search($limit: Int,
		$skip: Int,
		$category: [Int],
		$search: String){
		collections: searchCollections(rows: $limit,
			skip: $skip,
			search: $search,
			category: $category) {
			id
			name
			nodes{
				defaults
				name
				displayName
				icon
				iconData
				typeVersion: version
				categories{
					name
				}
			}
			workflows{
				id
			}
			totalViews: views
		}
	}`;
	return await graphql(apiEndpoint, gqlQuery, {search: query.search, category: query.categories && query.categories.length ? query.categories.map((id: string) => parseInt(id, 10)) : null});
}

export async function getWorkflows(
	apiEndpoint: string,
	query: {skip: number, limit: number, categories: string[], search: string},
): Promise<{data: {totalWorkflows: number, workflows: ITemplatesWorkflow[]}}> {
	const gqlQuery = `query search($limit: Int,
		$skip: Int,
		$category: [Int],
		$search: String){
		totalWorkflows: getWorkflowCount(search: $search, category: $category)
		workflows: searchWorkflows(rows: $limit,
			skip: $skip,
			search: $search,
			category: $category){
			id
			name
			nodes{
				defaults
				name
				displayName
				icon
				iconData
				typeVersion: version,
				categories{
					name
				}
			}
			totalViews: views
			user{
				username
			}
			created_at
		}
	}`;
	return await graphql(apiEndpoint, gqlQuery, {search: query.search, category: query.categories && query.categories.length? query.categories.map((id: string) => parseInt(id, 10)) : null, limit: query.limit, skip: query.skip});
}

export async function getCollectionById(apiEndpoint: string, collectionId: string): Promise<{data: {collection: ITemplatesCollectionResponse}}> {
	const query = `query getCollection($id: ID!){
		collection(id:$id){
			id
			name
			description
			image{
				id
				url
			}
			nodes{
				defaults
				name
				displayName
				icon
				iconData
				typeVersion: version
			}
			workflows(sort:"recentViews:desc,views:desc,name:asc"){
				id
				name
				nodes{
					defaults
					name
					displayName
					icon
					iconData
					typeVersion: version
					categories{
						id
						name
					}
				}
				categories{
					id
					name
				}
				user{
					username
				}
				totalViews: views
				created_at
			}
			totalViews: views
			categories{
				id
				name
			}
			created_at
		}
	}`;

	return await graphql(apiEndpoint, query, {id: collectionId});
}

export async function getTemplateById(apiEndpoint: string, templateId: string): Promise<{data: {workflow: ITemplatesWorkflowResponse}}> {
	const query = `query getWorkflow($id: ID!) {
		workflow(id: $id) {
			id
			name
			description
			image{
				id
				url
			}
			workflow
			nodes{
				defaults
				name
				displayName
				icon
				iconData
				typeVersion: version
				categories{
					id
					name
				}
			}
			totalViews: views
			categories{
				id
				name
			}
			user{
				username
			}
			created_at
		}
	}`;

	return await graphql(apiEndpoint, query, {id: templateId});
}