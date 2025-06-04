import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentReference,
  CollectionReference
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from '@angular/fire/storage';
import { Observable, from, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private firestore: Firestore,
    private storage: Storage
  ) { }

  // Firestore CRUD operations
  getCollection(path: string): Observable<any[]> {
    const collectionInstance = collection(this.firestore, path);
    return collectionData(collectionInstance, { idField: 'id' });
  }

  getDocumentById(path: string, id: string): Observable<any> {
    const documentInstance = doc(this.firestore, `${path}/${id}`);
    return docData(documentInstance, { idField: 'id' });
  }

  queryCollection(path: string, queryFn: (ref: CollectionReference) => any): Observable<any[]> {
    const collectionInstance = collection(this.firestore, path);
    const queryInstance = queryFn(collectionInstance);
    return collectionData(queryInstance, { idField: 'id' });
  }

  addDocument(path: string, data: any): Observable<DocumentReference> {
    const collectionInstance = collection(this.firestore, path);
    return from(addDoc(collectionInstance, data));
  }

  updateDocument(path: string, id: string, data: any): Observable<void> {
    const documentInstance = doc(this.firestore, `${path}/${id}`);
    return from(updateDoc(documentInstance, data));
  }

  deleteDocument(path: string, id: string): Observable<void> {
    const documentInstance = doc(this.firestore, `${path}/${id}`);
    return from(deleteDoc(documentInstance));
  }

  // Storage operations
  uploadFile(path: string, file: File): Observable<string> {
    const storageRef = ref(this.storage, `${path}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Observable<string>(observer => {
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          observer.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            observer.next(downloadURL);
            observer.complete();
          });
        }
      );
    });
  }

  deleteFile(path: string): Observable<void> {
    const storageRef = ref(this.storage, path);
    return from(deleteObject(storageRef));
  }
}
