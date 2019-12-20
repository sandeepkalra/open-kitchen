import ky from 'ky'

type Login = {
  username: string;
  password: string;
}

type Register = {
  username: string;
  email: string;
  password1: string;
  password2: string;
}

type User = {
  username: string;
  email: string;
}

export type Recipe = {
  title: string;
  ingredients: string;
  instructions: string;
  slug?: string;
}

const api = ky.create({ prefixUrl: `${process.env.REACT_APP_API_URL}/api/v1/` })
const withAuth = (token: string): any => api.extend({
  hooks: {
    beforeRequest: [
      (request): void => {
        request.headers.set('Authorization', token)
      },
    ],
  },
})

// Auth endpoints
export const login = (credentials: Login): Promise<{}> => api.post('auth/login', { json: credentials }).json()
export const logout = (token: string): Promise<{}> => withAuth(token).post('auth/logout').json()
export const register = (credentials: Register): Promise<{}> => api.post('auth/register', { json: credentials }).json()
export const updateUser = (user: User, token: string): Promise<{}> => withAuth(token).put('auth/user', { json: user }).json()

// Recipe endpoints
export const createRecipe = (recipe: Recipe, token: string): Promise<{}> => withAuth(token).post('recipes', { json: recipe }).json()
export const getRecipe = (slug: string): Promise<{}> => api.get(`recipes/${slug}`).json()
export const editRecipe = (recipe: Recipe, slug: string, token: string): Promise<{}> => withAuth(token).put(`recipes/${slug}`, { json: recipe }).json()
export const searchRecipes = (q: string): Promise<[]> => api.get(`recipes?q=${q}`).json()
export const getRecipesByUser = (username: string): Promise<[]> => api.get(`users/${username}/recipes`).json()
