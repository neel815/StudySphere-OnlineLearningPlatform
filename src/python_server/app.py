from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import logging

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    client = MongoClient('mongodb+srv://kuldeep:29114@cluster0.vnqof.mongodb.net/test')
    client.server_info()
    logger.info("Successfully connected to MongoDB Atlas")
    
    db = client['test']  
    courses_collection = db['courses']  
    
    collections = db.list_collection_names()
    logger.info(f"Collections in test database: {collections}")
    
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {str(e)}")
    raise

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "Welcome to StudySphere API",
        "endpoints": {
            "GET /": "This help message",
            "GET /testcourses": "Get all courses",
            "POST /addcourse": "Add a new course",
            "GET /course/<course_id>": "Get a specific course",
            "PUT /course/<course_id>": "Update a course",
            "DELETE /course/<course_id>": "Delete a course"
        }
    })

def fix_objectid(doc):
    if isinstance(doc, list):
        return [fix_objectid(item) for item in doc]
    elif isinstance(doc, dict):
        return {k: fix_objectid(v) for k, v in doc.items()}
    elif isinstance(doc, ObjectId):
        return str(doc)
    else:
        return doc


@app.route('/testcourses', methods=['GET'])
def get_courses():
    try:
        count = courses_collection.count_documents({})
        logger.info(f"Number of courses in database: {count}")
        
        sample_docs = list(courses_collection.find().limit(2))
        logger.info(f"Sample documents: {sample_docs}")
        
        all_courses = list(courses_collection.find())
        safe_courses = fix_objectid(all_courses)
        return jsonify(safe_courses)
    except Exception as e:
        logger.error(f"Error fetching courses: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/addcourse', methods=['POST'])
def add_course():
    data = request.json
    result = courses_collection.insert_one(data)
    return jsonify({"message": "Course added successfully", "id": str(result.inserted_id)})

@app.route('/course/<course_id>', methods=['GET'])
def get_single_course(course_id):
    course = courses_collection.find_one({"_id": ObjectId(course_id)})
    if course:
        safe_course = fix_objectid(course)
        return jsonify(safe_course)
    else:
        return jsonify({"error": "Course not found"}), 404

@app.route('/course/<course_id>', methods=['PUT'])
def update_course(course_id):
    data = request.json
    result = courses_collection.update_one({"_id": ObjectId(course_id)}, {"$set": data})
    if result.modified_count > 0:
        return jsonify({"message": "Course updated successfully"})
    else:
        return jsonify({"error": "Course not found or nothing changed"}), 404

@app.route('/course/<course_id>', methods=['DELETE'])
def delete_course(course_id):
    result = courses_collection.delete_one({"_id": ObjectId(course_id)})
    if result.deleted_count > 0:
        return jsonify({"message": "Course deleted successfully"})
    else:
        return jsonify({"error": "Course not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
