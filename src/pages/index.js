import React from 'react';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';


export default ({ data }) =>
  <div>
    {data.allFeature.edges.map(({node: { id, description, fluid }}) => (
      <div key={id}>
        <h1>{description}</h1>
        <img src={fluid.src} />
        <Img style={{width: 300}} fluid={fluid}/>
      </div>
    ))}
  </div>

export const query = graphql`
  query FeatureQuery {
    allFeature {
      totalCount
      edges {
        node {
          id
          description
          fluid {
            base64
            aspectRatio
            src
            srcSet
            sizes
          }
        }
      }
    }
  }
`
