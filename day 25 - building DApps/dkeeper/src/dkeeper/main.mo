// Since we're using the List object, we need to import it
import List "mo:base/List";
import Debug "mo:base/Debug";

/* In order to create the backend we will need to create an actor, let's name it the same as our DApp*/
actor DKeeper {
  // First we need to create a note object to store the value. Here we create an object prototype by defining a type
  type Note = {
    title : Text;
    content : Text;
  };

  // In order to create a list, we can use the following:
  stable var notes : List.List<Note> = List.nil<Note>();
  // This creates a new List variable which contains a list of Note objects, initialized to a List with nil Note objects
  // The last step of this project is to make this variable stable so that it persists throughout deployments

  // Now we need a function to create the note, basically C from CRUD in persistent storage
  public func createNote(noteTitle : Text, noteContent : Text) {
    // To create a new note, we can use the type we created earlier
    let newNote : Note = {
      title = noteTitle;
      content = noteContent;
    };

    // Similar to JS, we have a .push method for the list, but it appends to the start of the list instead of the end
    notes := List.push(newNote, notes);
    // We need to reassign the List returned by the push method to the notes List to update it
    // Now let's display the newly created list here
    Debug.print(debug_show (notes));
    // Now we need to connect this to our react application, but first we need to redeploy so the function is exposed
  };

  // To read the notes, we can simply use a query function instead of an update function
  public query func readNotes() : async [Note] {
    // This will return an array of Notes, an array is another data type used in Motoko which is similar to JS arrays
    // We can convert a list to an array using toArray method, so it is pretty simply
    return List.toArray(notes);
    // Let's now also add this functionality to the frontend
  };

  // Deleting a note is actually really tricky since we don't have a specific function to delete a particular list element
  // But we know: the id is in the order of the list, which is that newest is id 0 and oldest is n
  // We have three list functions available: take(returns a list with first n elements), drop(returns a list without first n elems),
  // and finally we have an append function which can join two lists together
  // The list data type actually looks like two element arrays, but second element is just nested array of next element
  public func deleteNote(id : Nat) {
    // Since an id is 0 and above, we can use the type Nat
    // We can test the code here: https://icp.ninja/editor?s=GoX4l
    // If we need to delete the element on index i, we need to take the first i elements
    let notesBefore = List.take(notes, id);
    // Then we also need all the elements after dropping all the elements including the ith element i.e. i+1 dropped elems
    let notesAfter = List.drop(notes, id + 1);
    // Finally we will append these to form the actual final list after deletion
    notes := List.append(notesBefore, notesAfter);
    // I haven't looked at solution yet, but let's first deploy and test, after updating the frontend
  };
};
