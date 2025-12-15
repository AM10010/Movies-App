import { Client, ID, Query, Databases } from "appwrite";
import Search from "./componants/Search";

const DatabaseID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const CollectionID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const ProjectID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(ProjectID);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    const result = await database.listDocuments(
      DatabaseID,
      CollectionID,
      [Query.equal('searchTerm', searchTerm)]
    );

    if (result.documents.length > 0) {
      const doc = result.documents[0];
      await database.updateDocument(DatabaseID, CollectionID, doc.$id, {
        count: doc.count + 1,

      });
    } else {
      await database.createDocument(DatabaseID, CollectionID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,

      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
  }
};

export const getTrendingMovies = async () => {
  try{
    const result = await database.listDocuments(
      DatabaseID,CollectionID,[
        Query.orderDesc('count'),
        Query.limit(5)
      ])

  return result.documents
  }
  catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
};