# Wildfire Compass
![Dahsboard](https://i.ibb.co/dcThYVd/Screenshot-2025-01-11-at-1-30-14-PM.png)
## Description
Wildfire Compass is a React dashboard and insurance planner designed to help people stay informed about current fires in California. It provides real-time data on active fires, air quality, and other critical information. The application also includes resources for emergency contacts, evacuation information, and preparedness tips.

## Architecture
Wildfire Compass is built using modern web technologies including React for the frontend, Tailwind CSS for styling, and Vite for the build tool. The application leverages several APIs to provide real-time data, including NASA FIRMS for fire data, OpenWeather for air quality, News API for the latest news updates and BlueSky for social media updates. The live fire mapping feature is powered by Mapbox, which displays a heatmap of fire locations based on data pulled regularly from NASA FIRMS. The CSV data from NASA FIRMS includes information on fire coordinates, brightness, and confidence levels, which are used to create a heatmap on the Mapbox map. The confidence values determine the color intensity of the heatmap, providing a visual representation of fire activity.

## Setup
To set up the project locally, follow these steps:

1. **Clone the repository:**
    ```sh
    git clone https://github.com/yourusername/wildfire-compass.git
    cd wildfire-compass
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Create a [.env](http://_vscodecontentref_/0) file:**
    Create a [.env](http://_vscodecontentref_/1) file in the root directory and add the following environment variables:
    ```env
    VITE_NASA_FIRMS_API_KEY=your_nasa_firms_api_key
    VITE_MAPBOX_TOKEN=your_mapbox_token
    VITE_OPENWEATHER_API_KEY=your_openweather_api_key
    VITE_NEWS_API_KEY=your_news_api_key
    VITE_BSKY_USERNAME=your_bluesky_username
    VITE_BSKY_PASSWORD=your_bluesky_password
    ```

4. **Run the development server:**
    ```sh
    npm run dev
    ```

5. **Build the project for production:**
    ```sh
    npm run build
    ```

6. **Preview the production build:**
    ```sh
    npm run preview
    ```


## Contact
For any questions or feedback, please contact:
- **Aakarsh Agrawal**
- Email: [aakarsh@seas.upenn.edu](mailto:aakarsh@seas.upenn.edu)