from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

app = Flask(__name__)
CORS(app)

# Load the pre-existing dataset and train the model
df = pd.read_csv("zameen-updated.csv")
df = df[df['purpose'] == 'For Rent']  # Limit to Rented properties only

# Convert Kanal to Marlas
df['area_in_marla'] = df.apply(lambda row: row['area'] * 20 if row['Area Type'] == 'Kanal' else row['area'], axis=1)

features = ['property_type', 'location', 'baths', 'bedrooms', 'area_in_marla']
target = 'price'

# Encode categorical data
categorical_features = ['property_type', 'location']
one_hot = OneHotEncoder(handle_unknown='ignore')

transformer = ColumnTransformer([('one_hot', one_hot, categorical_features)], remainder='passthrough')
transformer.fit(df[features])

# Pipeline
model = Pipeline(steps=[('transformer', transformer), ('model', RandomForestRegressor())])
model.fit(df[features], df[target])


# API endpoint for predicting price
@app.route('/api/predict_price', methods=['POST'])
def predict_price():
    try:
        data = request.get_json()

        # Extract user input from JSON
        user_location = data['location']
        user_property_type = data['property_type']
        user_baths = int(data['baths'])
        user_bedrooms = int(data['bedrooms'])
        user_area = float(data['area'])
        user_area_type = data['area_type']

        # Predict price using the trained model
        if user_area_type.lower() == 'kanal':
            user_area = user_area * 20  # Assuming 1 Kanal equals 20 Marlas

        input_data = pd.DataFrame([[user_property_type, user_location, user_baths, user_bedrooms, user_area]],
                                  columns=features)
        predicted_price = model.predict(input_data)[0]

        # additive factor
        predicted_price = predicted_price*1.5

        # Format the predicted price
        formatted_price = "{:,.2f} Rupees".format(predicted_price)

        return jsonify({'predicted_price': formatted_price})

    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(debug=True)
