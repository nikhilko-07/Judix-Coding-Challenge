
export const PostContainer = ({ data }) => {
    console.log("Data received:", data);

    return (
        <div>
            <h3>This is the post container</h3>

            {Array.isArray(data) ? (
                data.map((post, idx) => (
                    <div key={idx} style={{ marginBottom: "20px" }}>
                        <p>{post?.name}</p>

                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {post?.images?.map((img, i) => (
                                <img
                                    key={i}
                                    src={img.path}
                                    alt={post?.name}
                                    width={200}
                                    style={{
                                        borderRadius: "10px",
                                        objectFit: "cover",
                                        boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p>No posts available.</p>
            )}
        </div>
    );
};
