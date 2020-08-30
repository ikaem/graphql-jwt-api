import { gql } from "apollo-server-express";

export default gql`
  type Query {
    hello: String
    getUsers: [User]
    getUser(id: Int!): User
    getUserForEdit(id: Int): UserForEdit
    getCountries: [Country]
    getCountry(id: Int!): Country
    getPaginatedCountries(cursor: Int): PaginatedCountries
    getPaginatedUsers(cursor: Int): PaginatedUsers
  }

  type Mutation {
    newUser(
      email: String!
      password: String!
      first_name: String
      last_name: String
      country: Int
      city: String
      website: String
      age: Int
      hobbies: [String]!
      avatar_link: String
    ): User

    editUser(
      user_id: Int!
      email: String!
      first_name: String!
      last_name: String!
      country: Int!
      city: String!
      website: String!
      age: Int!
      hobbies: [String]!
      avatar_link: String!
    ): User

    deleteUser(user_id: Int): Boolean
    addCountry(country_name: String!): Country
    login(email: String!, password: String!): Me
    register(
        first_name: String!, 
        last_name: String!, 
        email: String!
        password: String!
        ): Me

    # register: Me
    refreshAccessToken: Me
    logout: Boolean
  }

  type User {
    user_id: ID
    email: String
    first_name: String
    last_name: String
    city: String
    website: String
    age: Int
    hobbies: [String]
    country: Country
    avatar_link: String
  }

  type UserForEdit {
    user: User
    countries: [Country]
  }

  type Country {
    country_id: ID
    country_name: String
  }

  type PaginatedCountries {
    countries: [Country]
    cursor: Int
    hasNextPage: Boolean
    totalCountries: Int
    countriesPerPage: Int
  }

  type PaginatedUsers {
    users: [User]
    cursor: Int
    hasNextPage: Boolean
    totalUsers: Int
    usersPerPage: Int
  }

  type Me {
    first_name: String
    avatar_link: String
    access_token: String
  }
`;
