const jsonResponseHandler = (deletions) => {
  return {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      if (deletions && deletions.length > 0) {
        for (const toDelete of deletions) {
          if (returnedObject[toDelete]) delete returnedObject[toDelete]
        }
      }

    }
  }
}

module.exports = {
  jsonResponseHandler
}