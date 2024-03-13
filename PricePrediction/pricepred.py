import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

df = pd.read_csv("zameen-updated.csv")

df = df[df['purpose'] == 'For Rent'] #Limit to Rented properties only

# Convert Kanal to Marlas
df['area_in_marla'] = df.apply(lambda row: row['area'] * 20 if row['Area Type'] == 'Kanal' else row['area'], axis=1)

# Display first few rows of the dataset
print("Sample Data:")
print(df.head())

features = ['property_type', 'location', 'baths', 'bedrooms', 'area_in_marla']
target = 'price'

# Encode categorical data
categorical_features = ['property_type', 'location']
one_hot = OneHotEncoder(handle_unknown='ignore')

transformer = ColumnTransformer([('one_hot', one_hot, categorical_features)], remainder='passthrough')

transformer.fit(df[features])

#pipeline
model = Pipeline(steps=[('transformer', transformer), ('model', RandomForestRegressor())])

model.fit(df[features], df[target])

print("\nTransformed Feature Names:")
print(transformer.get_feature_names_out())
    
# Display model performance
predictions = model.predict(df[features])
r2 = r2_score(df[target], predictions)
r2_percentage = r2 * 100
print(f"Model Accuracy (R-squared): {r2_percentage:.2f}%")

# Display model performance
print(f'R-squared: {r2}')

# Function to predict price based on user input
def predict_price_rf(location, property_type, baths, bedrooms, area, area_type):
    print("Predicting price...")
    if area_type.lower() == 'kanal':
        area = area * 20  # Assuming 1 Kanal equals 20 Marlas
    input_data = pd.DataFrame([[property_type, location, baths, bedrooms, area]], columns=features)
    return model.predict(input_data)[0]

# Function to allow the user to choose property type
def get_property_type():
    print("\nAvailable Property Types:")
    print("1. House")
    print("2. Flat")
    print("3. Upper Portion")
    print("4. Lower Portion")
    print("5. Penthouse")
    print("6. Room")
    print("7. Farm House")
    
    while True:
        try:
            choice = int(input("Enter the number corresponding to your property type choice: "))
            if 1 <= choice <= 7:
                property_types = ['House', 'Flat', 'Upper Portion', 'Lower Portion', 'Penthouse', 'Room', 'Farm House']
                return property_types[choice - 1]
            else:
                print("Invalid choice. Please select a valid property type.")
        except ValueError:
            print("Invalid input. Please enter a valid number.")

print("Starting user input...")
def user_interaction():
    while True:
        user_location = input("Enter the location (or type 'exit' to quit): ")
        if user_location.lower() == 'exit':
            break
        user_property_type = get_property_type()
        user_baths = int(input("Enter the number of baths: "))
        user_bedrooms = int(input("Enter the number of bedrooms: "))
        user_area = float(input("Enter the area size: "))
        user_area_type = input("Enter the area type (Kanal/Marla): ")

        predicted_price_rf = predict_price_rf(user_location, user_property_type, user_baths, user_bedrooms, user_area, user_area_type)
        formatted_price_rf = "{:,.2f} Rupees".format(predicted_price_rf)
        print(f"\nPredicted Price: {formatted_price_rf}")

# Call the function for user interaction
user_interaction()