import sqlite3

def register_user(full_name, username, email, phone_number, password):
    # Connect to the SQLite database
    connection = sqlite3.connect('users.db')
    cursor = connection.cursor()

    # Insert user data into the 'users' table
    cursor.execute("""
        INSERT INTO users (full_name, username, email, phone_number, password)
        VALUES (?, ?, ?, ?, ?)
    """, (full_name, username, email, phone_number, password))

    # Commit the changes and close the connection
    connection.commit()
    connection.close()

# Example usage
register_user("Sara", "sara_03", "sara@hotmail.com", "01010292938", "hashed_password")


