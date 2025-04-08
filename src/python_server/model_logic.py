from pymongo import MongoClient

def recommend_courses(user_query):
    client = MongoClient('mongodb+srv://kuldeep:29114@cluster0.vnqof.mongodb.net/test') 
    db = client['test'] 
    courses_collection = db['courses'] 

    courses = courses_collection.find({
        "tag": {"$regex": user_query, "$options": "i"}
    })

    recommendations = []
    for course in courses:
        recommendations.append({
            "courseName": course.get("courseName"),
            "courseDescription": course.get("courseDescription"),
            "price": course.get("price"),
            "thumbnail": course.get("thumbnail")
        })

    if not recommendations:
        return [{"message": "Sorry, no information available."}]
    
    return recommendations
