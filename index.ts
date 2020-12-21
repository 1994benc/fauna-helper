import faunadb, { query as q, Client } from 'faunadb';

/**
 * Helper for querying Fauna Database so we don't have to write FQL ourselves
 */
export class FaunaHelper {
    private _serverClient: Client;
    /**
     * Constructs an instance of QueryHelper by specifying a Fauna Server Key. This should only be used in server-side code.
     * @param _faunaServerKey Fauna server key
     */
    constructor(private _faunaServerKey: string) {
            this._serverClient = new Client({ secret: this._faunaServerKey });
    }
    /**
     * Query a paginated list of documents from a given collection
     * @param collectionName name of the collection from which you wish to query documents
     * @param pageSize pagination page size
     */
    public async getDocumentsFromCollection(collectionName: string, pageSize: number = 10) {
        return await this._serverClient.query(
            q.Map(
                q.Paginate(q.Documents(q.Collection(collectionName)), { size: pageSize }),
                q.Lambda((x: any) => q.Get(x))
            )
        );
    }
    /**
     * Query a single document by its ref ID
     * @param collectionName name of the collection from which you wish to query document
     * @param refId reference ID of the document
     */
    public async getDocumentByRefId(collectionName: string, refId: string) {
        return await this._serverClient.query(
            q.Get(q.Ref(q.Collection(collectionName), refId))
        )
    }

    /**
     * Query document(s) using a predefined index
     * @param indexName index name
     * @param valueToMatch search term
     */
    public async getDocumentByIndex(indexName: string, valueToMatch: string | number | faunadb.ExprArg) {
        return await this._serverClient.query(
            q.Get(
                q.Match(q.Index(indexName), valueToMatch)
            )
        );
    }

    /**
     * Create a new document in a given collection
     * @param collectionName name of the collection into which the document should be inserted
     * @param documentData document data to create. Don't include key 'data'
     * @param customId optional custom ID for the document
     */
    public async createDocument(collectionName: string, documentData: object, customId?: string) {
        if (customId) {
            return await this._serverClient.query(
                q.Create(
                    q.Ref(q.Collection(collectionName), customId),
                    { data: documentData },
                )
            )
        }
        return await this._serverClient.query(
            q.Create(
                q.Collection(collectionName),
                { data: documentData }
            )
        )
    }

    /**
     * 
     * @param collectionName name of the collection into which the documents should be inserted 
     * @param documentDataList a list of documents to create
     */
    public async createMultipleDocuments(collectionName: string, documentDataList: object[]) {
        return await this._serverClient.query(
            q.Map(
                documentDataList,
                q.Lambda(
                    'data',
                    q.Create(
                        q.Collection(collectionName),
                        { data: q.Var('data') },
                    )
                ),
            )
        )
    }

    /**
     * Updates specific fields in a document, and preserves the old fields if they are not specified in params. 
     * In the case of nested values (known as objects, due to the JSON data format), the old and the new values are merged. 
     * If null is specified as a value for a field, it is removed.
     * @param collectionName name of the collection containing the document
     * @param refId document reference ID
     * @param data new data
     */
    public async updateDocument(collectionName: string, refId: string, data: object) {
        return await this._serverClient.query(
            q.Update(
                q.Ref(q.Collection(collectionName), refId),
                { data },
            )
        )
    }
    /**
     *  replaces the document’s data with the fields provided in params. Old fields not mentioned in params are removed.
     * @param collectionName name of the collection containing the document
     * @param refId document reference ID
     * @param data new data
     */
    public async replaceDocument(collectionName: string, refId: string, data: object) {
        return await this._serverClient.query(
            q.Replace(
                q.Ref(q.Collection(collectionName), refId),
                { data },
            )
        );
    }

    /**
     * Removes a document by its reference ID from a given collection
     * @param collectionName name of the collection containing the document
     * @param refId document reference ID
     */
    public async deleteDocument(collectionName: string, refId: string) {
        return await this._serverClient.query(
            q.Delete(
                q.Ref(q.Collection(collectionName), refId)
            )
        )
    }
}