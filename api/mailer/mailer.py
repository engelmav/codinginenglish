import os

os.putenv("CIE_ENV", "prod")

from api.database.mysql_session import engine


with engine.connect() as cxn:
    res = cxn.execute("""
          select 
          coalesce(email, JSON_UNQUOTE(sa.app->'$."email"'), JSON_UNQUOTE(sa.app->'$."origEmail"')) as email
            from users u
          left outer join student_applications sa 
          on JSON_UNQUOTE(JSON_EXTRACT(sa.app, "$.email")) = u.email
          order by u.id
    """)
    with open("/home/vengelmann/mailing_list.txt", "w") as f:
        for row in res:
            email = row[0]
            if email:
                f.write(email+"\n")

